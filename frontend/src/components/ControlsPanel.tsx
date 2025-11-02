import { useState, useMemo, useRef, useEffect } from 'react';
import type { SupplyChainData, TimeRange, Company } from '../types';

import type { ViewType } from './SupplyChainGraph';

interface ControlsPanelProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  filterLevel: number | null;
  onFilterLevelChange: (level: number | null) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  data: SupplyChainData;
  companies: Company[];
  filteredCount?: number;
  onCompanySelect?: (company: Company) => void;
  viewType?: ViewType;
  onViewTypeChange?: (viewType: ViewType) => void;
}

export default function ControlsPanel({
  timeRange,
  onTimeRangeChange,
  filterLevel,
  onFilterLevelChange,
  searchQuery,
  onSearchQueryChange,
  data,
  companies,
  filteredCount,
  onCompanySelect,
  viewType = 'levels',
  onViewTypeChange,
}: ControlsPanelProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = filterLevel !== null || searchQuery !== '';

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const results: (Company & { matchType: string; matchText: string })[] = [];

    companies.forEach(company => {
      const nameMatch = company.name.toLowerCase().includes(query);
      const tickerMatch = company.ticker?.toLowerCase().includes(query);
      const countryMatch = company.country?.toLowerCase().includes(query);
      const roleMatch = company.role?.toLowerCase().includes(query);

      if (nameMatch || tickerMatch || countryMatch || roleMatch) {
        let matchType = '';
        let matchText = '';

        if (tickerMatch && company.ticker) {
          matchType = 'ticker';
          matchText = company.ticker;
        } else if (nameMatch) {
          matchType = 'name';
          matchText = company.name;
        } else if (countryMatch && company.country) {
          matchType = 'country';
          matchText = company.country;
        } else if (roleMatch) {
          matchType = 'role';
          matchText = company.role;
        }

        results.push({
          ...company,
          matchType,
          matchText,
        });
      }
    });

    // Sort by relevance: exact matches first, then by name
    return results.sort((a, b) => {
      const aExact = a.matchText.toLowerCase() === query ? 1 : 0;
      const bExact = b.matchText.toLowerCase() === query ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      return a.name.localeCompare(b.name);
    }).slice(0, 8); // Limit to 8 suggestions
  }, [searchQuery, companies]);

  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-500/30 text-yellow-200 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Handle suggestion click
  const handleSuggestionClick = (company: Company) => {
    onSearchQueryChange(company.name);
    setShowSuggestions(false);
    if (onCompanySelect) {
      onCompanySelect(company);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  const resetFilters = () => {
    onFilterLevelChange(null);
    onSearchQueryChange('');
  };

  return (
    <div className="h-full overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              {/* View Type Selector */}
              {onViewTypeChange && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Vue
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onViewTypeChange('levels')}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        viewType === 'levels'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50'
                          : 'bg-gray-800/40 text-gray-300 hover:bg-gray-800/70 hover:text-white border border-gray-700/40 hover:border-gray-600/50'
                      }`}
                      aria-label="Vue par niveaux"
                    >
                      Niveaux
                    </button>
                    <button
                      onClick={() => onViewTypeChange('radial')}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        viewType === 'radial'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50'
                          : 'bg-gray-800/40 text-gray-300 hover:bg-gray-800/70 hover:text-white border border-gray-700/40 hover:border-gray-600/50'
                      }`}
                      aria-label="Vue radiale"
                    >
                      Radiale
                    </button>
                    <button
                      onClick={() => onViewTypeChange('quadrant')}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        viewType === 'quadrant'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/50'
                          : 'bg-gray-800/40 text-gray-300 hover:bg-gray-800/70 hover:text-white border border-gray-700/40 hover:border-gray-600/50'
                      }`}
                      aria-label="Vue cadran"
                    >
                      Cadran
                    </button>
                  </div>
                </div>
              )}

              {/* Search Section */}
              <div>
            <label className="block text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wide">
              Recherche
            </label>
            <div className="relative" ref={searchInputRef}>
              <input
                type="text"
                placeholder="Nom, ticker, pays..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchQueryChange(e.target.value);
                  setShowSuggestions(e.target.value.length >= 2);
                }}
                onFocus={() => {
                  if (searchQuery.length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-800/50 border border-gray-700/40 rounded-lg px-3 py-2.5 pl-9 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all hover:border-gray-600/50 shadow-sm"
                aria-label="Rechercher une entreprise"
                aria-autocomplete="list"
                aria-expanded={showSuggestions && suggestions.length > 0}
                aria-controls="search-suggestions"
              />
              <svg
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {suggestions.length > 0 && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-400 font-medium">
                  {suggestions.length}
                </span>
              )}
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  id="search-suggestions"
                  className="absolute z-50 w-full mt-1.5 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                  role="listbox"
                >
                  {suggestions.map((company, index) => (
                        <div
                          key={company.id}
                          onClick={() => handleSuggestionClick(company)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={`
                            px-3 py-2.5 cursor-pointer transition-colors
                            ${index === highlightedIndex
                              ? 'bg-gray-800 border-l-2 border-blue-500'
                              : 'hover:bg-gray-800/50'
                            }
                          `}
                          role="option"
                          aria-selected={index === highlightedIndex}
                        >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm">
                            {highlightText(company.name, searchQuery)}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs">
                            {company.ticker && (
                              <span className="text-blue-400 font-medium">
                                {highlightText(company.ticker, searchQuery)}
                              </span>
                            )}
                            {company.country && (
                              <span className="text-gray-400">
                                🌍 {highlightText(company.country, searchQuery)}
                              </span>
                            )}
                            <span className="text-gray-500">
                              {highlightText(company.role, searchQuery)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-1">
                          {company.market_cap_billions && (
                            <span className="text-xs text-gray-400">
                              ${company.market_cap_billions}B
                            </span>
                          )}
                          {company.level !== undefined && (
                            <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                              Niv. {company.level}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

                  {/* Search tips */}
                  {searchQuery.length > 0 && searchQuery.length < 2 && (
                    <div className="absolute z-40 w-full mt-1.5 bg-gray-900/95 border border-gray-800/50 rounded-xl p-2 text-xs text-gray-500">
                      Tapez au moins 2 caractères
                    </div>
                  )}
            </div>
          </div>

              {/* Filters Section */}
              <div className="space-y-4">
                {/* Time Range Selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Période
                  </label>
                  <select
                    value={timeRange}
                    onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
                    className="w-full bg-gray-800/50 border border-gray-700/40 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none hover:border-gray-600/50 shadow-sm cursor-pointer"
                    aria-label="Sélectionner l'horizon temporel"
                  >
                    <option value="1h">1 Heure</option>
                    <option value="1d">1 Jour</option>
                    <option value="1w">1 Semaine</option>
                    <option value="1mo">1 Mois</option>
                    <option value="3mo">3 Mois</option>
                    <option value="6mo">6 Mois</option>
                    <option value="1y">1 An</option>
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Niveau
                  </label>
                  <select
                    value={filterLevel ?? ''}
                    onChange={(e) => onFilterLevelChange(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full bg-gray-800/40 border border-gray-700/30 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    aria-label="Filtrer par niveau"
                  >
                    <option value="">Tous les niveaux</option>
                    {data.supply_chain_levels.map((level) => (
                      <option key={level.level} value={level.level}>
                        Niveau {level.level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="pt-4 border-t border-gray-800/50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Entreprises</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold">{filteredCount ?? data.metadata.total_companies}</span>
                    {hasActiveFilters && filteredCount !== undefined && (
                      <>
                        <span className="text-gray-600">/</span>
                        <span className="text-gray-500">{data.metadata.total_companies}</span>
                      </>
                    )}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-800/40 hover:bg-gray-700/40 border border-gray-700/30 rounded-lg text-xs text-gray-300 hover:text-white transition-all"
                    aria-label="Réinitialiser les filtres"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
        </div>
      </div>
    </div>
  );
}

