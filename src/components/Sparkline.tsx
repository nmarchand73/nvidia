import type { StockData } from '../types';
import { getStockColor } from '../services/stockApi';

type SparklineType = 'price' | 'variation' | 'volatility';

interface SparklineProps {
  stockData: StockData;
  type?: SparklineType;
  width?: number;
  height?: number;
  showArea?: boolean;
}

export default function Sparkline({ 
  stockData, 
  type = 'price',
  width = 100, 
  height = 30,
  showArea = true 
}: SparklineProps) {
  const prices = stockData.prices.map(p => p.close);
  const firstPrice = prices[0];
  
  let values: number[];
  let trendColor: string;
  
  switch (type) {
    case 'variation': {
      // Pourcentage de variation depuis le début pour chaque point
      values = prices.map(price => ((price - firstPrice) / firstPrice) * 100);
      const lastVariation = values[values.length - 1];
      trendColor = getStockColor(lastVariation);
      break;
    }
    case 'volatility': {
      // Volatilité glissante sur une fenêtre de 7 jours
      const window = 7;
      values = prices.map((_, index) => {
        if (index < window - 1) {
          // Pas assez de données, utiliser les données disponibles
          const availablePrices = prices.slice(0, index + 1);
          const min = Math.min(...availablePrices);
          const max = Math.max(...availablePrices);
          return ((max - min) / min) * 100;
        } else {
          // Fenêtre glissante de 7 jours
          const windowPrices = prices.slice(index - window + 1, index + 1);
          const min = Math.min(...windowPrices);
          const max = Math.max(...windowPrices);
          return ((max - min) / min) * 100;
        }
      });
      // Pour la volatilité, on utilise une couleur neutre (orange/ambre) car c'est un indicateur non-directionnel
      trendColor = '#f59e0b'; // Amber-500
      break;
    }
    case 'price':
    default: {
      // Prix normal
      values = prices;
      trendColor = getStockColor(stockData.trend);
      break;
    }
  }
  
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;
  
  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1 || 1)) * chartWidth + padding;
    const y = chartHeight - ((value - minValue) / range) * chartHeight + padding;
    return { x, y };
  });

  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
  
  // Create area path for gradient fill
  let areaPath = '';
  if (showArea && points.length > 0) {
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    areaPath = `M ${firstPoint.x},${height} L ${firstPoint.x},${firstPoint.y} ` +
               `L ${pointsString} ` +
               `L ${lastPoint.x},${lastPoint.y} L ${lastPoint.x},${height} Z`;
  }

  const lastPoint = points[points.length - 1];

  return (
    <svg width={width} height={height} className="sparkline">
      <defs>
        <linearGradient id={`sparkline-gradient-${stockData.ticker}-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showArea && areaPath && (
        <path
          d={areaPath}
          fill={`url(#sparkline-gradient-${stockData.ticker}-${type})`}
        />
      )}
      <polyline
        points={pointsString}
        fill="none"
        stroke={trendColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      {lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2"
          fill={trendColor}
        />
      )}
    </svg>
  );
}

