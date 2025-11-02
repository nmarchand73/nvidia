import { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import SupplyChainGraph, { type ViewType } from './components/SupplyChainGraph';
import ControlsPanel from './components/ControlsPanel';
import DetailPanel from './components/DetailPanel';
import ExportButton from './components/ExportButton';
import type { Company, TimeRange, SupplyChainData } from './types';
import { loadSupplyChainDataAsync, getAllCompanies } from './services/dataLoader';
import './style.css';

function App() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('6mo');
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState<ViewType>('levels');
  const [data, setData] = useState<SupplyChainData | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    loadSupplyChainDataAsync().then((loadedData) => {
      setData(loadedData);
      setCompanies(getAllCompanies());
    });
  }, []);

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleCloseDetailPanel = () => {
    setSelectedCompany(null);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-2xl font-bold mb-2">Chargement...</div>
          <div className="text-gray-400">Chargement des données de la chaîne d'approvisionnement</div>
        </div>
      </div>
    );
  }

  const filteredCompanies = companies.filter(company => {
    if (filterLevel !== null && company.level !== filterLevel) return false;
    if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(company.ticker || '').toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <HashRouter>
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Header - Enhanced with better visual hierarchy */}
        <header className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800/90 backdrop-blur-xl border-b border-gray-700/40 sticky top-0 z-50 shadow-lg w-full">
          <div className="w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Logo - Enhanced */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/20">
                    N
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    NVIDIA Supply Chain
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Visualisation interactive de l'écosystème
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Export Button */}
                <ExportButton
                  companies={filteredCompanies}
                  filters={{
                    searchQuery,
                    filterLevel,
                    timeRange,
                  }}
                />
                
                {/* Version and date - Enhanced */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">v{data.metadata.version}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400">{formatDate(data.metadata.last_updated)}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Full page layout */}
        <div className="flex h-[calc(100vh-73px)] w-full overflow-hidden">
          {/* Controls Panel - Enhanced styling */}
          <div className="w-72 flex-shrink-0 border-r border-gray-700/40 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800/50 overflow-y-auto backdrop-blur-sm">
            <ControlsPanel
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              filterLevel={filterLevel}
              onFilterLevelChange={setFilterLevel}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              data={data}
              companies={companies}
              filteredCount={filteredCompanies.length}
              onCompanySelect={(company) => {
                handleCompanyClick(company);
              }}
              viewType={viewType}
              onViewTypeChange={setViewType}
            />
          </div>

          {/* Main Graph Area - Can scroll horizontally if needed */}
          <div className="flex-1 relative min-w-0 overflow-auto">
            <div className="min-w-full h-full">
              <SupplyChainGraph
                companies={filteredCompanies}
                data={data}
                timeRange={timeRange}
                selectedCompany={selectedCompany}
                onCompanyClick={handleCompanyClick}
                viewType={viewType}
              />
            </div>
          </div>
          
          {/* Detail Panel - Enhanced with better transitions */}
          <div className={`${selectedCompany ? 'w-[520px]' : 'w-0'} flex-shrink-0 border-l border-gray-700/40 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800/50 overflow-hidden transition-all duration-300 ease-out shadow-2xl`}>
            {selectedCompany ? (
              <DetailPanel
                company={selectedCompany}
                timeRange={timeRange}
                onClose={handleCloseDetailPanel}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">Sélectionnez une entreprise</p>
                  <p className="text-xs mt-2 text-gray-600">Cliquez sur un nœud du graphique pour voir les détails</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty state when no companies match filters */}
            {filteredCompanies.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center bg-gray-800/90 backdrop-blur-sm rounded-lg p-8 border border-gray-700 shadow-xl">
                  <svg className="w-10 h-10 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
                  <p className="text-gray-400 mb-4">Aucune entreprise ne correspond aux filtres sélectionnés.</p>
                  <button
                    onClick={() => {
                      setFilterLevel(null);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium pointer-events-auto"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            )}
      </div>
    </HashRouter>
  );
}

export default App;

