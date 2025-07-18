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
    { id: 'all', label: 'All IPOs', count: getCountByStatus('all') },
    { id: 'upcoming', label: 'Upcoming', count: getCountByStatus('upcoming') },
    { id: 'open', label: 'Open', count: getCountByStatus('open') },
    { id: 'closed', label: 'Closed', count: getCountByStatus('closed') },
    { id: 'listed', label: 'Listed', count: getCountByStatus('listed') }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeFilter} onValueChange={onFilterChange} className="py-4">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex">
            {filters.map((filter) => (
              <TabsTrigger 
                key={filter.id} 
                value={filter.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {filter.label}
                <Badge variant="secondary" className="text-xs">
                  {filter.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}