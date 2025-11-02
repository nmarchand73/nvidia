export interface Company {
  id: number;
  name: string;
  ticker: string;
  level?: number;
  exchange?: string;
  alternate_ticker?: string;
  alternate_exchange?: string;
  market_cap_billions?: number;
  country?: string;
  role: string;
  products?: string[];
  customers?: string[];
  criticality: number;
  nvidia_correlation?: number;
  supply_chain_position?: string;
  relationship_to_nvidia?: string;
  importance_notes?: string;
  recommendation?: string;
}

export interface SupplyChainLevel {
  level: number;
  name: string;
  description: string;
  companies: Company[];
}

export interface SupplyChainData {
  metadata: {
    title: string;
    version: string;
    last_updated: string;
    total_companies: number;
    currency: string;
    data_source: string;
  };
  supply_chain_levels: SupplyChainLevel[];
  investment_strategies?: any[];
  market_data_2025?: any;
  expansion_timeline?: any[];
}

export interface StockData {
  ticker: string;
  prices: Array<{
    date: number;
    close: number;
  }>;
  currentPrice: number;
  trend: number; // Pourcentage de variation
  trendValue: number; // Valeur absolue de variation
}

export type TimeRange = '1h' | '1d' | '1w' | '1mo' | '3mo' | '6mo' | '1y';

