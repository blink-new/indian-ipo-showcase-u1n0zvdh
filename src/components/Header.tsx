import { Search, TrendingUp, Database, RefreshCw } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
}

export function Header({ 
  searchQuery, 
  onSearchChange, 
  onRefresh, 
  isRefreshing = false,
  lastUpdated 
}: HeaderProps) {
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Mobile */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">IPO Central</h1>
                <p className="text-xs text-gray-500">Indian Market</p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="px-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search IPOs..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between h-16">
          {/* Logo - Desktop */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">IPO Central</h1>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  <Database className="w-3 h-3 mr-1" />
                  Live API
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                Indian Market • Updated {formatLastUpdated(lastUpdated)}
              </p>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search IPOs, companies, sectors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>

          {/* Actions - Desktop */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm">
              Market Analysis
            </Button>
            <Button size="sm">
              Track IPO
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}