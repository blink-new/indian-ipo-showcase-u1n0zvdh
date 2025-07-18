import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterTabs } from './components/FilterTabs';
import { IPOCard } from './components/IPOCard';
import { IPODetailsModal } from './components/IPODetailsModal';
import { IPOGridSkeleton } from './components/IPOCardSkeleton';
import { LiveDataIndicator } from './components/LiveDataIndicator';
import { IPO } from './data/mockData';
import { useIPOData } from './hooks/useIPOData';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Alert, AlertDescription } from './components/ui/alert';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedIPOId, setSelectedIPOId] = useState<string | null>(null);
  
  // Use live IPO data
  const { ipos, loading, error, refreshData, lastUpdated } = useIPOData();

  const filteredIPOs = useMemo(() => {
    let filtered = ipos;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(ipo => ipo.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ipo => 
        ipo.companyName.toLowerCase().includes(query) ||
        ipo.sector.toLowerCase().includes(query) ||
        ipo.industry.toLowerCase().includes(query) ||
        ipo.symbol.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [ipos, searchQuery, activeFilter]);

  const selectedIPO = selectedIPOId ? ipos.find(ipo => ipo.id === selectedIPOId) || null : null;

  const handleViewDetails = (id: string) => {
    setSelectedIPOId(id);
  };

  const handleCloseModal = () => {
    setSelectedIPOId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <FilterTabs 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        ipos={ipos}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}. Showing cached data if available.
            </AlertDescription>
          </Alert>
        )}

        {/* Results Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeFilter === 'all' ? 'All IPOs' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} IPOs`}
                </h2>
                <LiveDataIndicator 
                  isLive={!error && !loading}
                  lastUpdated={lastUpdated}
                  error={error}
                />
              </div>
              <p className="text-gray-600">
                {filteredIPOs.length} {filteredIPOs.length === 1 ? 'IPO' : 'IPOs'} found
                {searchQuery && ` for "${searchQuery}"`}
                {lastUpdated && (
                  <span className="ml-2 text-sm text-gray-500">
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <Button
              onClick={refreshData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* IPO Grid */}
        {loading ? (
          <IPOGridSkeleton />
        ) : filteredIPOs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIPOs.map((ipo) => (
              <IPOCard 
                key={ipo.id}
                ipo={ipo}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No IPOs found</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `No IPOs match your search for "${searchQuery}". Try adjusting your search terms.`
                  : 'No IPOs available for the selected filter.'
                }
              </p>
            </div>
          </div>
        )}
      </main>

      {/* IPO Details Modal */}
      <IPODetailsModal 
        ipo={selectedIPO}
        isOpen={!!selectedIPOId}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;