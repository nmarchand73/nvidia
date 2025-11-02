import axios from 'axios';
import type { StockData, TimeRange } from '../types';

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const CACHE_KEY_PREFIX = 'stock_data_';

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        symbol: string;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          close: number[];
        }>;
      };
    }>;
  };
}

function getCacheKey(ticker: string, range: TimeRange): string {
  return `${CACHE_KEY_PREFIX}${ticker}_${range}`;
}

/**
 * Formate le ticker selon l'échange pour Yahoo Finance
 * @param ticker - Ticker brut (ex: "3037", "TSM", "000660")
 * @param exchange - Code d'échange (ex: "TWSE", "NYSE", "NASDAQ", "Korea Exchange", "Tokyo Stock Exchange")
 * @returns Ticker formaté pour Yahoo Finance (ex: "3037.TW", "TSM", "000660.KS")
 */
function formatTickerForYahoo(ticker: string, exchange?: string): string {
  if (!exchange) {
    // Si pas d'échange, supposer que c'est déjà formaté ou US
    return ticker;
  }

  const exchangeUpper = exchange.toUpperCase();
  
  // Taïwan (TWSE)
  if (exchangeUpper.includes('TWSE') || exchangeUpper === 'TW' || exchangeUpper.includes('TAIWAN')) {
    return `${ticker}.TW`;
  }
  
  // Corée du Sud (Korea Exchange)
  if (exchangeUpper.includes('KOREA') || exchangeUpper.includes('KRX') || exchangeUpper === 'KR') {
    return `${ticker}.KS`;
  }
  
  // Japon (Tokyo Stock Exchange)
  // Yahoo Finance requires tickers to be padded to 4 digits for Japanese stocks
  if (exchangeUpper.includes('TOKYO') || exchangeUpper.includes('TSE') || exchangeUpper === 'JP') {
    // Pad ticker to 4 digits only if needed (e.g., "123" -> "0123", "6967" stays "6967")
    // Most Japanese tickers are already 4 digits
    const paddedTicker = ticker.length < 4 ? ticker.padStart(4, '0') : ticker;
    return `${paddedTicker}.T`;
  }
  
  // Hong Kong
  if (exchangeUpper.includes('HONG KONG') || exchangeUpper.includes('HKEX') || exchangeUpper === 'HK') {
    return `${ticker}.HK`;
  }
  
  // Chine
  if (exchangeUpper.includes('SHANGHAI') || exchangeUpper.includes('SHENZHEN') || exchangeUpper === 'CN') {
    // Yahoo Finance utilise .SS pour Shanghai et .SZ pour Shenzhen
    // Par défaut, on utilise .SS
    return `${ticker}.SS`;
  }
  
  // Autres bourses européennes
  if (exchangeUpper.includes('VIENNA') || exchangeUpper.includes('WIEN')) {
    return `${ticker}.VI`;
  }
  
  // Norvège (Oslo Børs)
  if (exchangeUpper.includes('OSLO') || exchangeUpper.includes('OSL') || exchangeUpper.includes('BØRS')) {
    return `${ticker}.OL`;
  }
  
  // Danemark (Copenhagen Stock Exchange)
  if (exchangeUpper.includes('COPENHAGEN') || exchangeUpper.includes('COPENHAGUE') || exchangeUpper.includes('CSE') || exchangeUpper === 'DK') {
    return `${ticker}.CO`;
  }
  
  // Allemagne (Frankfurt / Deutsche Börse)
  if (exchangeUpper.includes('FRANKFURT') || exchangeUpper.includes('DEUTSCHE') || exchangeUpper.includes('XETRA') || exchangeUpper === 'DE' || exchangeUpper === 'GERMANY') {
    return `${ticker}.DE`;
  }
  
  // OTC (Over-The-Counter) - généralement pas de suffixe
  if (exchangeUpper.includes('OTC') || exchangeUpper.includes('OVER-THE-COUNTER')) {
    return ticker; // OTC tickers are usually already correct
  }
  
  // Pour NYSE/NASDAQ/US, le ticker est déjà correct
  if (exchangeUpper.includes('NYSE') || exchangeUpper.includes('NASDAQ') || exchangeUpper.includes('US')) {
    return ticker;
  }
  
  // Par défaut, retourner le ticker tel quel
  return ticker;
}

function getCachedData(ticker: string, range: TimeRange): StockData | null {
  try {
    const cacheKey = getCacheKey(ticker, range);
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

function setCachedData(ticker: string, range: TimeRange, data: StockData): void {
  try {
    const cacheKey = getCacheKey(ticker, range);
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache stock data', error);
  }
}

export async function fetchStockData(
  ticker: string,
  range: TimeRange = '3mo',
  exchange?: string,
  alternateTicker?: string,
  alternateExchange?: string
): Promise<StockData | null> {
  // Formater le ticker selon l'échange
  const formattedTicker = formatTickerForYahoo(ticker, exchange);
  
  // Vérifier le cache d'abord avec le ticker formaté
  const cached = getCachedData(formattedTicker, range);
  if (cached) {
    // Mapper le ticker formaté vers le ticker original dans les données retournées
    return { ...cached, ticker };
  }

  try {
    // Determine the appropriate interval based on the range
    // Yahoo Finance intervals: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
    // For short periods, use smaller intervals
    let interval: string;
    switch (range) {
      case '1h':
        interval = '1m'; // 1 minute intervals for 1 hour
        break;
      case '1d':
        interval = '5m'; // 5 minute intervals for 1 day
        break;
      case '1w':
        interval = '1h'; // 1 hour intervals for 1 week
        break;
      case '1mo':
      case '3mo':
      case '6mo':
      case '1y':
      default:
        interval = '1d'; // Daily intervals for longer periods
        break;
    }

    // Convert range format for Yahoo Finance API
    // Yahoo uses: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    // Our format: 1h, 1d, 1w, 1mo, 3mo, 6mo, 1y
    let yahooRange: string;
    switch (range) {
      case '1h':
        yahooRange = '1d'; // Yahoo doesn't support 1h, use 1d but filter to last hour
        break;
      case '1d':
        yahooRange = '1d';
        break;
      case '1w':
        yahooRange = '5d'; // Use 5d which gives us enough data for 1 week
        break;
      case '1mo':
        yahooRange = '1mo';
        break;
      case '3mo':
        yahooRange = '3mo';
        break;
      case '6mo':
        yahooRange = '6mo';
        break;
      case '1y':
        yahooRange = '1y';
        break;
      default:
        yahooRange = range;
        break;
    }

    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${formattedTicker}?interval=${interval}&range=${yahooRange}`;
    
    // Try different methods in order
    const methods = [
      // Method 1: Try vite proxy in dev (fastest, most reliable)
      async () => {
        if (import.meta.env.DEV) {
          console.log(`[${formattedTicker}] Trying Vite proxy...`);
          const proxyUrl = `/api/yahoo-finance/v8/finance/chart/${formattedTicker}?interval=${interval}&range=${yahooRange}`;
          const response = await axios.get<YahooFinanceResponse>(proxyUrl, { timeout: 10000 });
          console.log(`[${formattedTicker}] Vite proxy success!`, response.data?.chart ? 'Has chart data' : 'No chart data');
          return response.data;
        }
        throw new Error('Not in dev mode');
      },
      // Method 2: Use CORS proxy (corsproxy.io)
      async () => {
        console.log(`[${formattedTicker}] Trying CORS proxy (corsproxy.io)...`);
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(yahooUrl)}`;
        const response = await axios.get<YahooFinanceResponse>(proxyUrl, { timeout: 15000 });
        if (response.data && response.data.chart) {
          console.log(`[${formattedTicker}] CORS proxy success!`, 'Has chart data');
          return response.data;
        }
        throw new Error('Invalid proxy response - no chart data');
      },
      // Method 3: Use CORS proxy (allorigins.win)
      async () => {
        console.log(`[${formattedTicker}] Trying CORS proxy (allorigins.win)...`);
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooUrl)}`;
        const proxyResponse = await axios.get(proxyUrl, { timeout: 15000 });
        if (proxyResponse.data && proxyResponse.data.contents) {
          try {
            const parsed = JSON.parse(proxyResponse.data.contents);
            if (parsed && parsed.chart) {
              console.log(`[${formattedTicker}] CORS proxy success!`, 'Has chart data');
              return parsed;
            }
          } catch (parseError) {
            console.error(`[${formattedTicker}] Failed to parse proxy response:`, parseError);
          }
        }
        throw new Error('Invalid proxy response - no contents or parse error');
      },
      // Method 4: Direct API (may fail due to CORS)
      async () => {
        console.log(`[${formattedTicker}] Trying direct API...`);
        const response = await axios.get<YahooFinanceResponse>(yahooUrl, {
          timeout: 10000,
          headers: { 'Accept': 'application/json' }
        });
        console.log(`[${formattedTicker}] Direct API success!`, response.data?.chart ? 'Has chart data' : 'No chart data');
        return response.data;
      }
    ];

    let responseData: any = null;
    let lastError: any = null;
    let methodIndex = 0;

    for (const method of methods) {
      methodIndex++;
      try {
        responseData = await method();
        if (responseData && responseData.chart && responseData.chart.result && responseData.chart.result.length > 0) {
          console.log(`[${formattedTicker}] Success with method ${methodIndex}`);
          break; // Success, exit loop
        } else {
          console.warn(`[${formattedTicker}] Method ${methodIndex} returned data but no chart result`);
          if (responseData) {
            console.warn(`[${formattedTicker}] Response structure:`, {
              hasChart: !!responseData.chart,
              hasResult: !!responseData.chart?.result,
              resultLength: responseData.chart?.result?.length || 0
            });
          }
        }
      } catch (error: any) {
        lastError = error;
        console.warn(`[${formattedTicker}] Method ${methodIndex} failed:`, error.message);
        if (error.response) {
          console.warn(`[${formattedTicker}] Response status:`, error.response.status);
        }
        continue;
      }
    }

    if (!responseData || !responseData.chart) {
      console.error(`[${formattedTicker}] All methods failed. Last error:`, lastError);
      if (lastError?.response) {
        console.error(`[${formattedTicker}] HTTP Status:`, lastError.response.status);
        console.error(`[${formattedTicker}] Response data:`, lastError.response.data);
      }
      // Try alternative ticker formats for international exchanges
      if (exchange && formattedTicker.includes('.')) {
        const baseTicker = ticker;
        const [base, suffix] = formattedTicker.split('.');
        console.log(`[${baseTicker}] Trying alternative formats for ${exchange}...`);
        
        // Special case: Asetek was listed on Oslo but moved to Copenhagen
        // Try ASTK.CO (correct Copenhagen ticker) if the original was ASETEK
        const exchangeUpper = exchange.toUpperCase();
        if (baseTicker === 'ASETEK' && exchangeUpper.includes('OSLO')) {
          try {
            console.log(`[${baseTicker}] Trying ASTK.CO (Copenhagen exchange)...`);
            const altUrl = `https://query1.finance.yahoo.com/v8/finance/chart/ASTK.CO?interval=${interval}&range=${yahooRange}`;
            const altResponse = await axios.get<YahooFinanceResponse>(`https://corsproxy.io/?${encodeURIComponent(altUrl)}`, { timeout: 10000 });
            if (altResponse.data && altResponse.data.chart && altResponse.data.chart.result && altResponse.data.chart.result.length > 0) {
              console.log(`[${baseTicker}] Found data with ASTK.CO!`);
              responseData = altResponse.data;
            }
          } catch (altError) {
            console.warn(`[${baseTicker}] ASTK.CO also failed`);
          }
        }
        
        // Try without suffix as fallback for some exchanges
        if (!responseData && (suffix === 'OL' || suffix === 'VI' || suffix === 'CO')) {
          try {
            const altUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${baseTicker}?interval=${interval}&range=${yahooRange}`;
            const altResponse = await axios.get<YahooFinanceResponse>(`https://corsproxy.io/?${encodeURIComponent(altUrl)}`, { timeout: 10000 });
            if (altResponse.data && altResponse.data.chart && altResponse.data.chart.result && altResponse.data.chart.result.length > 0) {
              console.log(`[${baseTicker}] Found data without suffix!`);
              responseData = altResponse.data;
            }
          } catch (altError) {
            console.warn(`[${baseTicker}] Alternative format also failed`);
          }
        }
        
        // For Japanese stocks (.T), try alternative formats if padded version fails
        if (!responseData && suffix === 'T') {
          // Try with original ticker (in case it's already correctly formatted)
          try {
            const originalTicker = ticker; // Use the original ticker, not baseTicker (which might be padded)
            const altUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${originalTicker}.T?interval=${interval}&range=${yahooRange}`;
            const altResponse = await axios.get<YahooFinanceResponse>(`https://corsproxy.io/?${encodeURIComponent(altUrl)}`, { timeout: 10000 });
            if (altResponse.data && altResponse.data.chart && altResponse.data.chart.result && altResponse.data.chart.result.length > 0) {
              console.log(`[${baseTicker}] Found data with original ticker format!`);
              responseData = altResponse.data;
            }
          } catch (altError) {
            console.warn(`[${baseTicker}] Alternative Japanese ticker format also failed`);
          }
        }
      }
      
      // Try alternate ticker if available (usually OTC/ADR which is more accessible)
      if (!responseData && alternateTicker && alternateExchange) {
        try {
          console.log(`[${ticker}] Trying alternate ticker ${alternateTicker} on ${alternateExchange}...`);
          const altFormattedTicker = formatTickerForYahoo(alternateTicker, alternateExchange);
          const altUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${altFormattedTicker}?interval=${interval}&range=${yahooRange}`;
          
          // Try with CORS proxy first
          try {
            const altResponse = await axios.get<YahooFinanceResponse>(`https://corsproxy.io/?${encodeURIComponent(altUrl)}`, { timeout: 10000 });
            if (altResponse.data && altResponse.data.chart && altResponse.data.chart.result && altResponse.data.chart.result.length > 0) {
              console.log(`[${ticker}] Found data with alternate ticker ${altFormattedTicker}!`);
              responseData = altResponse.data;
            }
          } catch (altError) {
            // If proxy fails, try direct (may fail due to CORS)
            try {
              const altResponse = await axios.get<YahooFinanceResponse>(altUrl, {
                timeout: 10000,
                headers: { 'Accept': 'application/json' }
              });
              if (altResponse.data && altResponse.data.chart && altResponse.data.chart.result && altResponse.data.chart.result.length > 0) {
                console.log(`[${ticker}] Found data with alternate ticker ${altFormattedTicker} (direct)!`);
                responseData = altResponse.data;
              }
            } catch (directError) {
              console.warn(`[${ticker}] Alternate ticker ${altFormattedTicker} also failed`);
            }
          }
        } catch (altError) {
          console.warn(`[${ticker}] Error trying alternate ticker:`, altError);
        }
      }
      
      if (!responseData || !responseData.chart) {
        return null;
      }
    }

    const response = { data: responseData };
    
    // Continue with existing parsing logic...
    
    const result = response.data.chart?.result?.[0];

    if (!result) {
      console.warn(`[${formattedTicker}] No result in chart data`, response.data);
      // Check if there's an error message in the response
      if (response.data.chart?.error) {
        console.error(`[${formattedTicker}] Yahoo Finance error:`, response.data.chart.error);
      }
      return null;
    }

    if (!result.indicators || !result.indicators.quote || !result.indicators.quote[0]) {
      console.warn(`[${formattedTicker}] No quote data available`, {
        hasIndicators: !!result.indicators,
        hasQuote: !!result.indicators?.quote,
        quoteLength: result.indicators?.quote?.length || 0,
        resultKeys: Object.keys(result)
      });
      return null;
    }

    const { meta, timestamp, indicators } = result;
    const closes = indicators.quote[0].close;
    
    if (!timestamp || !closes || timestamp.length === 0) {
      console.warn(`[${formattedTicker}] Invalid data structure - timestamp:`, timestamp?.length, 'closes:', closes?.length);
      return null;
    }

    console.log(`[${formattedTicker}] Processing ${timestamp.length} data points...`);
    
    // Filter prices and apply time-based filtering if needed
    let prices = timestamp
      .map((ts, i) => ({
        date: ts * 1000, // Convert to milliseconds
        close: closes[i],
      }))
      .filter(p => p.close !== null && p.close !== undefined && !isNaN(p.close));
    
    // For 1 hour period, filter to only the last hour of data
    if (range === '1h' && prices.length > 0) {
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000); // 1 hour in milliseconds
      prices = prices.filter(p => p.date >= oneHourAgo);
      
      if (prices.length === 0) {
        console.warn(`[${formattedTicker}] No data points in the last hour, using all available data`);
        // Fallback: use all available data if no data in last hour
        prices = timestamp
          .map((ts, i) => ({
            date: ts * 1000,
            close: closes[i],
          }))
          .filter(p => p.close !== null && p.close !== undefined && !isNaN(p.close));
      } else {
        console.log(`[${formattedTicker}] Filtered to ${prices.length} data points from the last hour`);
      }
    }
    
    // For 1 day period, filter to only the last 24 hours of data
    if (range === '1d' && prices.length > 0) {
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000); // 24 hours in milliseconds
      const originalLength = prices.length;
      prices = prices.filter(p => p.date >= oneDayAgo);
      
      if (prices.length === 0) {
        console.warn(`[${formattedTicker}] No data points in the last 24 hours, using all available data`);
        // Fallback: use all available data if no data in last 24 hours
        prices = timestamp
          .map((ts, i) => ({
            date: ts * 1000,
            close: closes[i],
          }))
          .filter(p => p.close !== null && p.close !== undefined && !isNaN(p.close));
      } else if (prices.length < originalLength) {
        console.log(`[${formattedTicker}] Filtered to ${prices.length} data points from the last 24 hours (was ${originalLength})`);
      }
    }
    
    // For 1 week period, ensure we only use the last 7 days
    if (range === '1w' && prices.length > 0) {
      const now = Date.now();
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
      const originalLength = prices.length;
      prices = prices.filter(p => p.date >= oneWeekAgo);
      
      if (prices.length < originalLength) {
        console.log(`[${formattedTicker}] Filtered to ${prices.length} data points from the last week (was ${originalLength})`);
      }
    }

    if (prices.length === 0) {
      console.warn(`[${formattedTicker}] No valid prices found after filtering`);
      return null;
    }

    console.log(`[${formattedTicker}] Valid prices: ${prices.length} out of ${timestamp.length}`);

    const firstPrice = prices[0].close;
    const lastPrice = prices[prices.length - 1].close;
    const trend = ((lastPrice - firstPrice) / firstPrice) * 100;
    const trendValue = lastPrice - firstPrice;
    const currentPrice = meta?.regularMarketPrice || lastPrice;

    const stockData: StockData = {
      ticker,
      prices,
      currentPrice,
      trend,
      trendValue,
    };

    console.log(`[${formattedTicker}] Stock data created:`, {
      pricesCount: prices.length,
      currentPrice,
      trend: `${trend.toFixed(2)}%`,
      trendValue
    });

    // Mettre en cache avec le ticker formaté, mais retourner avec le ticker original
    setCachedData(formattedTicker, range, stockData);

    return stockData;
  } catch (error: any) {
    console.error(`Error fetching stock data for ${formattedTicker}:`, error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. CORS issue?', error.request);
    }
    return null;
  }
}

/**
 * Convertit une valeur de tendance en couleur avec dégradé
 * @param trend - Pourcentage de variation (-100 à +100)
 * @returns Code couleur hexadécimal
 */
export function getStockColor(trend: number | null | undefined): string {
  if (trend === null || trend === undefined) return '#6b7280'; // Gris par défaut
  
  // Dégradé de vert pour les variations positives avec courbe exponentielle pour plus de contraste
  if (trend > 0) {
    // Utiliser une courbe carrée pour accentuer les différences (normalisation sur 30% au lieu de 50%)
    // Cela rend les variations plus visibles pour les valeurs moyennes
    const normalizedTrend = Math.min(trend / 30, 1);
    // Appliquer une courbe carrée pour rendre le dégradé plus franc
    const curvedTrend = Math.pow(normalizedTrend, 1.5);
    
    // Interpolation entre vert très clair (#a7f3d0 = green-200) et vert très foncé (#15803d = green-700)
    // Couleurs plus contrastées pour une meilleure visibilité
    const startR = 167; // green-200
    const startG = 243;
    const startB = 208;
    const endR = 21;   // green-700
    const endG = 128;
    const endB = 61;
    
    const r = Math.round(startR + (endR - startR) * curvedTrend);
    const g = Math.round(startG + (endG - startG) * curvedTrend);
    const b = Math.round(startB + (endB - startB) * curvedTrend);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  // Dégradé de rouge pour les variations négatives avec courbe exponentielle pour plus de contraste
  if (trend < 0) {
    // Utiliser une courbe carrée pour accentuer les différences (normalisation sur 30% au lieu de 50%)
    const normalizedTrend = Math.min(Math.abs(trend) / 30, 1);
    // Appliquer une courbe carrée pour rendre le dégradé plus franc
    const curvedTrend = Math.pow(normalizedTrend, 1.5);
    
    // Interpolation entre rouge très clair (#fecaca = red-200) et rouge très foncé (#991b1b = red-800)
    // Couleurs plus contrastées pour une meilleure visibilité
    const startR = 254; // red-200
    const startG = 202;
    const startB = 202;
    const endR = 153;   // red-800
    const endG = 27;
    const endB = 27;
    
    const r = Math.round(startR + (endR - startR) * curvedTrend);
    const g = Math.round(startG + (endG - startG) * curvedTrend);
    const b = Math.round(startB + (endB - startB) * curvedTrend);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  // Tendance à 0 (stable)
  return '#6b7280'; // Gris
}

