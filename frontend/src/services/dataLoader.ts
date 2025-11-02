import type { SupplyChainData, Company } from '../types';

// Import the JSON file - in production this would be a static asset
// For now, we'll load it dynamically
let cachedData: SupplyChainData | null = null;

export async function loadSupplyChainDataAsync(): Promise<SupplyChainData> {
  if (cachedData) return cachedData;

  try {
    // Try multiple paths for the JSON file
    let response = await fetch('/companies.json');
    if (!response.ok) {
      response = await fetch('/src/data/companies.json');
    }
    if (!response.ok) {
      response = await fetch('./companies.json');
    }
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    cachedData = await response.json() as SupplyChainData;
    return cachedData;
  } catch (error) {
    console.error('Error loading supply chain data:', error);
    // Return minimal data structure if file not found
    return {
      metadata: {
        title: 'Nvidia Supply Chain',
        version: '1.0',
        last_updated: new Date().toISOString(),
        total_companies: 0,
        currency: 'USD',
        data_source: 'Local',
      },
      supply_chain_levels: [],
    };
  }
}

export function loadSupplyChainData(): SupplyChainData {
  // Try to load synchronously if already cached, otherwise return empty structure
  if (cachedData) return cachedData;

  // For initial load, we need async loading, but this function should be called after async load
  return {
    metadata: {
      title: 'Nvidia Supply Chain',
      version: '1.0',
      last_updated: new Date().toISOString(),
      total_companies: 0,
      currency: 'USD',
      data_source: 'Local',
    },
    supply_chain_levels: [],
  };
}

export function getAllCompanies(): Company[] {
  const data = cachedData || loadSupplyChainData();
  // Map companies and assign level from parent
  const allCompanies = data.supply_chain_levels.flatMap(levelData => 
    levelData.companies.map(company => ({
      ...company,
      level: levelData.level
    }))
  );
  
  // Add NVIDIA if not present
  const hasNvidia = allCompanies.some(c => 
    c.name.toLowerCase().includes('nvidia')
  );
  
  if (!hasNvidia) {
    const nvidia: Company = {
      id: 0,
      name: 'NVIDIA',
      ticker: 'NVDA',
      level: 0,
      exchange: 'NASDAQ',
      role: 'GPU and AI Systems Manufacturer',
      market_cap_billions: 4000,
      country: 'USA',
      criticality: 5,
      nvidia_correlation: 1.0,
      supply_chain_position: 'core',
      relationship_to_nvidia: 'Core company',
      importance_notes: 'CORE',
    };
    return [nvidia, ...allCompanies];
  }
  
  return allCompanies;
}

export function getCompanyById(id: number): Company | undefined {
  const companies = getAllCompanies();
  return companies.find(c => c.id === id);
}

export function getNvidiaCompany(): Company | undefined {
  const companies = getAllCompanies();
  return companies.find(c => c.name.toLowerCase().includes('nvidia')) || companies[0];
}
