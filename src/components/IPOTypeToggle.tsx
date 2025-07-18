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
    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
      <Button
        variant={activeType === 'mainboard' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('mainboard')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          activeType === 'mainboard'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Building2 className="h-4 w-4" />
        <span className="font-medium">Mainboard</span>
        {mainboardCount > 0 && (
          <Badge 
            variant={activeType === 'mainboard' ? 'secondary' : 'outline'}
            className="ml-1 text-xs"
          >
            {mainboardCount}
          </Badge>
        )}
      </Button>
      
      <Button
        variant={activeType === 'sme' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('sme')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          activeType === 'sme'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <TrendingUp className="h-4 w-4" />
        <span className="font-medium">SME</span>
        {smeCount > 0 && (
          <Badge 
            variant={activeType === 'sme' ? 'secondary' : 'outline'}
            className="ml-1 text-xs"
          >
            {smeCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}