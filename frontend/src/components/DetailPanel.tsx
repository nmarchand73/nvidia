import type { Company, TimeRange, StockData } from '../types';
import { useEffect, useState } from 'react';
import { fetchStockData, getStockColor } from '../services/stockApi';
import StockTrendChart from './StockTrendChart';
import Sparkline from './Sparkline';

interface DetailPanelProps {
  company: Company;
  timeRange: TimeRange;
  onClose: () => void;
}

const getCriticalityColor = (criticality: number): string => {
  if (criticality >= 4) return 'bg-red-500/20 text-red-400 border-red-500/50';
  if (criticality >= 3) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
  if (criticality >= 2) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
  return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
};

const getCriticalityLabel = (criticality: number): string => {
  if (criticality >= 4) return 'Très Critique';
  if (criticality >= 3) return 'Critique';
  if (criticality >= 2) return 'Important';
  return 'Standard';
};

export default function DetailPanel({ company, timeRange, onClose }: DetailPanelProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!company.ticker) {
      setLoading(false);
      setStockData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setStockData(null);
    setError(null);
    
    fetchStockData(company.ticker, timeRange, company.exchange, company.alternate_ticker, company.alternate_exchange)
      .then((data) => {
        if (data) {
          console.log(`Stock data loaded for ${company.ticker}:`, data);
          setStockData(data);
          setError(null);
        } else {
          // Provide more specific error message
          const exchangeInfo = company.exchange ? ` sur ${company.exchange}` : '';
          setError(`Aucune donnée disponible pour ${company.ticker}${exchangeInfo}. L'API peut être indisponible ou le ticker invalide. ${company.alternate_ticker ? `Essai du ticker alternatif ${company.alternate_ticker}...` : ''}`);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Error loading stock data for ${company.ticker}:`, error);
        setError(`Erreur lors du chargement des données pour ${company.ticker}. Vérifiez la console pour plus de détails.`);
        setStockData(null);
        setLoading(false);
      });
  }, [company.ticker, timeRange]);

  const trend = stockData?.trend ?? null;
  const trendColor = getStockColor(trend);

  return (
    <div className="w-full h-full bg-gray-900 overflow-y-auto min-h-full">
      {/* Header - Enhanced sticky header */}
      <div className="sticky top-0 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800/90 backdrop-blur-xl border-b-2 border-gray-700/50 z-10 shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white mb-2 truncate">{company.name}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                {company.ticker && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-400">{company.ticker}</span>
                    {company.exchange && (
                      <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-800/50 rounded">({company.exchange})</span>
                    )}
                  </div>
                )}
                {company.country && (
                  <span className="text-xs text-gray-400">
                    {company.country}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 group relative w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 hover:bg-red-600/20 border border-gray-700/50 hover:border-red-500/50 transition-all duration-200"
              aria-label="Fermer le panneau de détails"
              title="Fermer"
            >
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Quick stats row - Enhanced */}
          <div className="grid grid-cols-2 gap-3">
            {company.market_cap_billions && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700/40 shadow-lg backdrop-blur-sm hover:border-blue-500/30 transition-all">
                <div className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Capitalisation</div>
                <div className="text-xl font-bold text-blue-400 tracking-tight">${company.market_cap_billions}B</div>
              </div>
            )}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-xl p-4 border border-gray-700/40 shadow-lg backdrop-blur-sm hover:border-blue-500/30 transition-all">
              <div className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">Criticité</div>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${getCriticalityColor(company.criticality)}`}>
                {getCriticalityLabel(company.criticality)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Stock Trend Section - Enhanced */}
        {company.ticker && (
          <div className="bg-gradient-to-br from-gray-800/50 via-gray-800/40 to-gray-800/30 rounded-xl p-6 border border-gray-700/40 shadow-xl backdrop-blur-sm">
            <h3 className="text-xs font-medium text-gray-400 mb-5 uppercase tracking-wide">
              Tendance Boursière
            </h3>
            {loading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="h-16 bg-gray-600 rounded-lg"></div>
                    <div className="h-16 bg-gray-600 rounded-lg"></div>
                    <div className="h-16 bg-gray-600 rounded-lg"></div>
                  </div>
                  <div className="h-40 bg-gray-600 rounded-lg"></div>
                </div>
              </div>
            ) : stockData && stockData.prices && stockData.prices.length > 0 ? (
              <div className="space-y-5">
                {/* Stats Grid - Improved layout with wider cards */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Trend Card - Enhanced */}
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/40 rounded-xl p-4 border border-gray-700/40 shadow-md hover:shadow-lg hover:border-gray-600/50 transition-all min-w-[120px] overflow-visible">
                    <div className="flex items-center justify-between mb-2 gap-1">
                      <div className="text-xs text-gray-400 flex-shrink-0">Variation</div>
                      {stockData && <div className="flex-shrink-0"><Sparkline stockData={stockData} type="variation" width={40} height={18} /></div>}
                    </div>
                    <div className="text-base font-bold break-words whitespace-normal" style={{ color: trendColor }}>
                      {trend !== null ? `${trend > 0 ? '+' : ''}${parseFloat(trend.toFixed(2))}%` : 'N/A'}
                    </div>
                    {stockData.trendValue !== undefined && (
                      <div className={`text-xs mt-1 break-words whitespace-normal ${trend && trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend && trend >= 0 ? '+' : ''}${parseFloat(stockData.trendValue.toFixed(2))}
                      </div>
                    )}
                  </div>

                  {/* Price Card - Enhanced */}
                  {stockData.currentPrice && (
                    <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/40 rounded-xl p-4 border border-gray-700/40 shadow-md hover:shadow-lg hover:border-gray-600/50 transition-all min-w-[120px] overflow-visible">
                      <div className="flex items-center justify-between mb-2 gap-1">
                        <div className="text-xs text-gray-400 flex-shrink-0">Prix actuel</div>
                        {stockData && <div className="flex-shrink-0"><Sparkline stockData={stockData} type="price" width={40} height={18} /></div>}
                      </div>
                      <div className="text-base font-bold text-gray-200 break-words whitespace-normal" title={`$${stockData.currentPrice.toFixed(2)}`}>
                        {stockData.currentPrice >= 1000 
                          ? `$${parseFloat((stockData.currentPrice / 1000).toFixed(2))}K`
                          : `$${parseFloat(stockData.currentPrice.toFixed(2))}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 break-words whitespace-normal">
                        {company.ticker}
                      </div>
                    </div>
                  )}

                  {/* Volatility Card */}
                  {(() => {
                    const minPrice = Math.min(...stockData.prices.map((p: { close: number }) => p.close));
                    const maxPrice = Math.max(...stockData.prices.map((p: { close: number }) => p.close));
                    const volatility = ((maxPrice - minPrice) / minPrice) * 100;
                    
                    // Calculate the actual duration
                    const firstDate = new Date(stockData.prices[0].date);
                    const lastDate = new Date(stockData.prices[stockData.prices.length - 1].date);
                    const diffMs = lastDate.getTime() - firstDate.getTime();
                    const diffHours = diffMs / (1000 * 60 * 60);
                    const diffDays = diffMs / (1000 * 60 * 60 * 24);
                    
                    let durationText: string;
                    if (diffHours < 1) {
                      const diffMinutes = Math.round(diffMs / (1000 * 60));
                      durationText = diffMinutes === 1 ? '1 min' : `${diffMinutes} min`;
                    } else if (diffHours < 24) {
                      const hours = Math.round(diffHours);
                      durationText = hours === 1 ? '1 h' : `${hours} h`;
                    } else {
                      const days = Math.round(diffDays);
                      durationText = days === 1 ? '1 j' : `${days} j`;
                    }
                    
                    return (
                      <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/40 rounded-xl p-4 border border-gray-700/40 shadow-md hover:shadow-lg hover:border-gray-600/50 transition-all min-w-[120px] overflow-visible">
                        <div className="flex items-center justify-between mb-2 gap-1">
                          <div className="text-xs text-gray-400 flex-shrink-0">Volatilité</div>
                          {stockData && <div className="flex-shrink-0"><Sparkline stockData={stockData} type="volatility" width={40} height={18} /></div>}
                        </div>
                        <div className="text-base font-bold text-gray-200 break-words whitespace-normal">
                          {parseFloat(volatility.toFixed(2))}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1 break-words whitespace-normal">
                          {durationText}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Chart */}
                <div className="pt-4">
                  <StockTrendChart stockData={stockData} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                {error ? (
                  <>
                    <div className="text-red-400 text-sm mb-2 font-medium">⚠️ Erreur</div>
                    <div className="text-gray-400 text-xs px-2">{error}</div>
                  </>
                ) : (
                  <>
                    <div className="text-gray-500 text-sm mb-2">Données non disponibles</div>
                    <div className="text-gray-600 text-xs">
                      {company.ticker ? `Impossible de charger les données pour ${company.ticker}` : 'Pas de ticker disponible'}
                    </div>
                    <div className="text-gray-600 text-xs mt-2">
                      Vérifiez la console du navigateur pour plus de détails
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

            {/* Company Details - Enhanced */}
            <div className="bg-gradient-to-br from-gray-800/50 via-gray-800/40 to-gray-800/30 rounded-xl p-6 border border-gray-700/40 shadow-xl backdrop-blur-sm">
              <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wide">
                Informations
              </h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Rôle</dt>
                  <dd className="text-white font-medium">{company.role}</dd>
                </div>
                {company.country && (
                  <div>
                    <dt className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Pays</dt>
                    <dd className="text-white font-medium">{company.country}</dd>
                  </div>
                )}
                {company.nvidia_correlation !== undefined && (
                  <div>
                    <dt className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Corrélation NVIDIA</dt>
                    <dd className="text-white font-medium">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-semibold text-blue-400">{(company.nvidia_correlation * 100).toFixed(1)}%</span>
                        <div className="flex-1 bg-gray-700/30 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all shadow-sm"
                            style={{ width: `${Math.abs(company.nvidia_correlation) * 100}%` }}
                          />
                        </div>
                      </div>
                    </dd>
                  </div>
                )}
                {company.importance_notes && (
                  <div>
                    <dt className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Note</dt>
                    <dd className="text-gray-300 text-sm leading-relaxed">{company.importance_notes}</dd>
                  </div>
                )}
          </dl>
        </div>

            {/* Products - Enhanced */}
            {company.products && company.products.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/50 via-gray-800/40 to-gray-800/30 rounded-xl p-6 border border-gray-700/40 shadow-xl backdrop-blur-sm">
                <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Produits
                </h3>
            <ul className="space-y-2">
              {company.products.map((product, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{product}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

            {/* Customers - Enhanced */}
            {company.customers && company.customers.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/50 via-gray-800/40 to-gray-800/30 rounded-xl p-6 border border-gray-700/40 shadow-xl backdrop-blur-sm">
                <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Clients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.customers.map((customer, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-md text-xs text-gray-300 transition-colors"
                    >
                      {customer}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Relationship - Enhanced */}
            {company.relationship_to_nvidia && (
              <div className="bg-gradient-to-br from-gray-800/50 via-gray-800/40 to-gray-800/30 rounded-xl p-6 border border-gray-700/40 shadow-xl backdrop-blur-sm">
                <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  Relation avec NVIDIA
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">{company.relationship_to_nvidia}</p>
              </div>
            )}

        {/* Investment Strategy Recommendations */}
        {company.importance_notes?.includes('TOP PICK') && (
          <div className="bg-gradient-to-r from-green-900/40 to-green-800/30 border border-green-600/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">⭐</span>
              <div className="text-xs font-bold text-green-400">TOP PICK</div>
            </div>
            <div className="text-xs text-green-200 leading-relaxed">{company.importance_notes}</div>
          </div>
        )}

        {(company.importance_notes?.includes('AVOID') || 
         company.importance_notes?.includes('Éviter')) && (
          <div className="bg-gradient-to-r from-red-900/40 to-red-800/30 border border-red-600/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">⚠️</span>
              <div className="text-xs font-bold text-red-400">À ÉVITER</div>
            </div>
            <div className="text-xs text-red-200 leading-relaxed">{company.importance_notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}

