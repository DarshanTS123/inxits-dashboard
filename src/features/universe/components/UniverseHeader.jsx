import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';
import { ChipGroup } from '@components/ui/Chip/Chip';

export const UniverseHeader = ({
  query,
  onQueryChange,
  lastUpdated,
  onOpenFilters,
  filterChips = [],
  onRemoveFilter,
  onClearFilters,
  showClearAll = false,
}) => {
  return (
    <div className="space-y-4">
      {lastUpdated && (
        <p className="text-sm italic text-paragraph">
          Nav updated as on <span className="font-bold">{lastUpdated}.</span>
        </p>
      )}
      <div className="flex min-w-0 items-center gap-3">
        <div className="w-full max-w-[420px] shrink-0">
          <Input
            size="sm"
            placeholder="Search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            leftIcon={Search}
            className="h-10 bg-helper"
          />
        </div>
        <Button
          variant="outline"
          leftIcon={SlidersHorizontal}
          className="h-10 shrink-0 border-stroke-divider bg-helper font-normal text-heading hover:bg-layer2"
          onClick={onOpenFilters}
        >
          Filters
        </Button>

        {showClearAll && (
          <button
            type="button"
            onClick={onClearFilters}
            className="shrink-0 text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:text-primary/80"
          >
            CLEAR ALL
          </button>
        )}

        <ChipGroup items={filterChips} onRemove={onRemoveFilter} />
      </div>
    </div>
  );
};
