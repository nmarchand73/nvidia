import type { StockData } from '../types';
import { getStockColor } from '../services/stockApi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StockTrendChartProps {
  stockData: StockData;
}

export default function StockTrendChart({ stockData }: StockTrendChartProps) {
  const data = stockData.prices.map(price => ({
    date: new Date(price.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    fullDate: new Date(price.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    price: price.close,
    timestamp: price.date,
  }));

  // Calculate the actual number of days/hours/minutes between first and last data point
  const firstDate = new Date(stockData.prices[0].date);
  const lastDate = new Date(stockData.prices[stockData.prices.length - 1].date);
  const diffMs = lastDate.getTime() - firstDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  // Format the duration text
  let durationText: string;
  if (diffHours < 1) {
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    durationText = diffMinutes === 1 ? '1 minute' : `${diffMinutes} minutes`;
  } else if (diffHours < 24) {
    const hours = Math.round(diffHours);
    durationText = hours === 1 ? '1 heure' : `${hours} heures`;
  } else if (diffDays < 7) {
    const days = Math.round(diffDays);
    durationText = days === 1 ? '1 jour' : `${days} jours`;
  } else {
    const days = Math.round(diffDays);
    durationText = days === 1 ? '1 jour' : `${days} jours`;
  }

  const trendColor = getStockColor(stockData.trend);
  const gradientId = `gradient-${stockData.trend >= 0 ? 'green' : 'red'}-${stockData.ticker}`;
  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const volatility = priceRange / minPrice * 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const price = payload[0].value as number;
      
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-1">{data.fullDate || label}</p>
          <p className="text-lg font-bold" style={{ color: trendColor }}>
            ${price.toFixed(2)}
          </p>
          {stockData.currentPrice && (
            <p className="text-xs text-gray-400 mt-1">
              Variation: {((price - stockData.currentPrice) / stockData.currentPrice * 100).toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full bg-gray-900/30 rounded-lg p-4 border border-gray-700/20">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          Évolution sur {durationText}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(stockData.prices[0].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {new Date(stockData.prices[stockData.prices.length - 1].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 15, left: 5, bottom: 30 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={trendColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={10}
            interval="preserveStartEnd"
            tick={{ fill: '#9ca3af', angle: -45, textAnchor: 'end' }}
            axisLine={{ stroke: '#4b5563' }}
            tickCount={6}
            height={60}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={11}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            tick={{ fill: '#9ca3af' }}
            axisLine={{ stroke: '#4b5563' }}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={trendColor}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={trendColor}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: trendColor, strokeWidth: 2, stroke: '#1f2937' }}
            isAnimationActive={true}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

