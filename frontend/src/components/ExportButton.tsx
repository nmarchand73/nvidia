import { useState } from 'react';
import type { Company } from '../types';

interface ExportButtonProps {
  companies: Company[];
  filters?: {
    searchQuery?: string;
    filterLevel?: number | null;
    timeRange?: string;
  };
}

export default function ExportButton({ companies, filters }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    
    const headers = ['ID', 'Nom', 'Ticker', 'Niveau', 'Pays', 'Rôle', 'Capitalisation (B)', 'Criticité', 'Corrélation NVIDIA'];
    const rows = companies.map(company => [
      company.id,
      company.name,
      company.ticker || '',
      company.level ?? '',
      company.country || '',
      company.role,
      company.market_cap_billions ?? '',
      company.criticality,
      company.nvidia_correlation ? (company.nvidia_correlation * 100).toFixed(1) + '%' : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `nvidia-supply-chain-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
    setIsOpen(false);
  };

  const exportToJSON = () => {
    setIsExporting(true);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      filters: filters || {},
      totalCompanies: companies.length,
      companies: companies.map(company => ({
        id: company.id,
        name: company.name,
        ticker: company.ticker,
        level: company.level,
        country: company.country,
        role: company.role,
        market_cap_billions: company.market_cap_billions,
        criticality: company.criticality,
        nvidia_correlation: company.nvidia_correlation,
        relationship_to_nvidia: company.relationship_to_nvidia,
        products: company.products,
        customers: company.customers,
      })),
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `nvidia-supply-chain-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
    setIsOpen(false);
  };

  const exportScreenshot = async () => {
    setIsExporting(true);
    
    try {
      // Export the graph area
      const graphElement = document.querySelector('.w-full.h-full.relative');
      if (!graphElement) {
        alert('Impossible de capturer le graphique');
        setIsExporting(false);
        setIsOpen(false);
        return;
      }

      // Try to dynamically import html2canvas using a runtime string-based import
      // This prevents Vite from analyzing it at build time
      let html2canvas;
      try {
        // Use Function constructor to create a dynamic import that won't be analyzed by Vite
        const importFn = new Function('specifier', 'return import(specifier)');
        const html2canvasModule = await importFn('html2canvas');
        html2canvas = html2canvasModule.default || html2canvasModule;
      } catch (importError) {
        alert('La capture d\'écran nécessite la bibliothèque html2canvas.\n\nPour l\'installer, exécutez:\nnpm install html2canvas\n\nOu utilisez CSV/JSON pour l\'export.');
        setIsExporting(false);
        setIsOpen(false);
        return;
      }

      const canvas = await html2canvas(graphElement as HTMLElement, {
        backgroundColor: '#111827',
        scale: 2,
      });

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          alert('Erreur lors de la génération de l\'image');
          setIsExporting(false);
          setIsOpen(false);
          return;
        }

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `nvidia-supply-chain-${new Date().toISOString().split('T')[0]}.png`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setIsExporting(false);
        setIsOpen(false);
      }, 'image/png');
    } catch (error) {
      console.error('Error exporting screenshot:', error);
      alert('Erreur lors de la capture d\'écran. Utilisez CSV ou JSON pour l\'export.');
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const shareLink = () => {
    const params = new URLSearchParams();
    if (filters?.searchQuery) params.set('search', filters.searchQuery);
    if (filters?.filterLevel !== undefined && filters.filterLevel !== null) {
      params.set('level', filters.filterLevel.toString());
    }
    if (filters?.timeRange) params.set('timeRange', filters.timeRange);

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'NVIDIA Supply Chain Visualizer',
        text: 'Voir cette visualisation de la chaîne d\'approvisionnement NVIDIA',
        url: url,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papiers !');
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papiers !');
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Lien copié dans le presse-papiers !');
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:cursor-not-allowed border border-blue-500/50 rounded-lg text-xs font-medium text-white transition-all"
        aria-label="Exporter les données"
        aria-expanded={isOpen}
      >
        {isExporting ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Export...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Exporter</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && !isExporting && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800/50 rounded-xl shadow-2xl z-50">
            <div className="py-1">
              <button
                onClick={exportToCSV}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter en CSV
              </button>
              <button
                onClick={exportToJSON}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Exporter en JSON
              </button>
              <button
                onClick={exportScreenshot}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Capturer le graphique
              </button>
              <div className="border-t border-gray-700 my-1"></div>
              <button
                onClick={shareLink}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Partager le lien
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

