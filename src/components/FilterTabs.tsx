import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { IPO } from '../services/liveIPOService';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  ipos: IPO[];
}

export function FilterTabs({ activeFilter, onFilterChange, ipos }: FilterTabsProps) {
  const getCountByStatus = (status: string) => {
    if (status === 'all') return ipos.length;
    return ipos.filter(ipo => ipo.status === status).length;
  };

  const filters = [
    { id: 'all', label: 'All IPOs', shortLabel: 'All', count: getCountByStatus('all') },
    { id: 'upcoming', label: 'Upcoming', shortLabel: 'Upcoming', count: getCountByStatus('upcoming') },
    { id: 'open', label: 'Open', shortLabel: 'Open', count: getCountByStatus('open') },
    { id: 'closed', label: 'Closed', shortLabel: 'Closed', count: getCountByStatus('closed') },
    { id: 'listed', label: 'Listed', shortLabel: 'Listed', count: getCountByStatus('listed') }
  ];

  return (
    <div className="w-full">
      <Tabs value={activeFilter} onValueChange={onFilterChange}>
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          {filters.map((filter) => (
            <TabsTrigger 
              key={filter.id} 
              value={filter.id}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 data-[state=active]:bg-primary data-[state=active]:text-white text-xs sm:text-sm"
            >
              <span className="font-medium">
                <span className="hidden sm:inline">{filter.label}</span>
                <span className="sm:hidden">{filter.shortLabel}</span>
              </span>
              <Badge 
                variant="secondary" 
                className="text-xs min-w-[20px] h-5 flex items-center justify-center"
              >
                {filter.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}