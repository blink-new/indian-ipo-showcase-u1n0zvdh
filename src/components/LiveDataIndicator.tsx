import { Wifi, WifiOff, AlertCircle, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

interface LiveDataIndicatorProps {
  isLive: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

export function LiveDataIndicator({ 
  isLive, 
  lastUpdated, 
  error 
}: LiveDataIndicatorProps) {
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

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
          Connection Error
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isLive ? (
        <>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Wifi className="w-4 h-4 text-green-600" />
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            Live Data
          </Badge>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-gray-400" />
          <Badge variant="secondary" className="bg-gray-50 text-gray-600">
            Demo Data
          </Badge>
        </>
      )}
      
      {lastUpdated && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatLastUpdated(lastUpdated)}</span>
        </div>
      )}
    </div>
  );
}