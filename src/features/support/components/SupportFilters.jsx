import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';

export const SupportFilters = ({ totalTickets, query, onQueryChange, onFilter }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[16px] font-semibold text-heading">
        Ticket List ({totalTickets})
      </h2>
      <div className="flex items-center gap-3">
        <div className="w-full sm:w-80">
          <Input
            size="sm"
            placeholder="Search"
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            leftIcon={Search}
            className="h-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={SlidersHorizontal}
          className="h-10 gap-2 border-stroke-divider bg-transparent px-4 text-paragraph/70"
          onClick={onFilter}
        >
          Filters
        </Button>
      </div>
    </div>
  );
};
