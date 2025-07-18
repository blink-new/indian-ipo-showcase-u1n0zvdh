import { IPOType } from '../services/liveIPOService';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Building2, TrendingUp } from 'lucide-react';

interface IPOTypeToggleProps {
  activeType: IPOType;
  onTypeChange: (type: IPOType) => void;
  mainboardCount: number;
  smeCount: number;
}

export function IPOTypeToggle({ 
  activeType, 
  onTypeChange, 
  mainboardCount, 
  smeCount 
}: IPOTypeToggleProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
      <Button
        variant={activeType === 'mainboard' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('mainboard')}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md transition-all flex-1 sm:flex-none ${
          activeType === 'mainboard'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Building2 className="h-4 w-4" />
        <span className="font-medium text-sm sm:text-base">Mainboard</span>
        {mainboardCount > 0 && (
          <Badge 
            variant={activeType === 'mainboard' ? 'secondary' : 'outline'}
            className="ml-1 text-xs hidden sm:inline-flex"
          >
            {mainboardCount}
          </Badge>
        )}
      </Button>
      
      <Button
        variant={activeType === 'sme' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('sme')}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md transition-all flex-1 sm:flex-none ${
          activeType === 'sme'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <TrendingUp className="h-4 w-4" />
        <span className="font-medium text-sm sm:text-base">SME</span>
        {smeCount > 0 && (
          <Badge 
            variant={activeType === 'sme' ? 'secondary' : 'outline'}
            className="ml-1 text-xs hidden sm:inline-flex"
          >
            {smeCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}