import { useEffect, useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { Modal } from '@components/ui/Modal/Modal';
import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';
import { StarRating } from '@components/ui/StarRating/StarRating';
import { cn } from '@utils/cn';
import { DEFAULT_FILTERS } from '../utils/universeFilters';

const FILTER_CATEGORIES = [
  { id: 'category', label: 'Category Selection' },
  { id: 'equity', label: 'Equity' },
  { id: 'debt', label: 'Debt' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'others', label: 'Others' },
  { id: 'rating', label: 'inXits Rating' },
  { id: 'fund-house', label: 'Fund House' },
  { id: 'fund-manager', label: 'Fund Manager' },
];

const FILTER_OPTIONS = {
  equity: [
    'Dividend Yield',
    'ELSS (Tax Savings)',
    'Flexi Cap',
    'Focused Fund',
    'Large Cap',
    'Mid Cap',
    'Small Cap',
    'Multi Cap',
  ],
  debt: [
    'Banking & PSU',
    'Corporate Bond',
    'Credit Risk',
    'Dynamic Bond',
    'Gilt',
    'Liquid',
    'Low Duration',
    'Medium Duration',
  ],
  hybrid: [
    'Aggressive',
    'Arbitrage',
    'Balanced Advantage',
    'Conservative',
    'Equity Savings',
    'Multi Asset Allocation',
  ],
  others: [
    'Commodities',
    'Debt - Fund of Funds',
    'Equity - Fund of Funds',
    'Equity - ULIP',
    'FoFs (Domestic)',
    'FoFs (Overseas)',
  ],
  rating: [5, 4, 3, 2, 1],
  'fund-house': [
    'Bajaj Finserv Mutual Fund',
    'Bank of India Mutual Fund',
    'DSP Mutual Fund',
    'Axis Mutual Fund',
    'HDFC Mutual Fund',
    'ICICI Prudential Mutual Fund',
    'Kotak Mahindra Mutual Fund',
    'Nippon India Mutual Fund',
    'SBI Mutual Fund',
    'UTI Mutual Fund',
  ],
  'fund-manager': [
    'Abhishek Gupta',
    'Ajay Tyagi',
    'Anil Kumar',
    'Amit Singh',
    'Meena Kumari',
    'Pooja Shah',
    'Rajesh V',
    'Sanjay Gupta',
    'Vijay Sharma',
  ],
};

const SEARCHABLE_CATEGORIES = new Set([
  'equity',
  'debt',
  'hybrid',
  'others',
  'fund-house',
  'fund-manager',
]);

const FILTER_STATE_KEYS = {
  equity: 'equity',
  debt: 'debt',
  hybrid: 'hybrid',
  others: 'others',
  rating: 'rating',
  'fund-house': 'fundHouse',
  'fund-manager': 'fundManager',
};

function FilterCheckbox({ checked, onChange, label, className }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 py-2 text-[15px] text-heading select-none',
        className
      )}
    >
      <span className="relative flex shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <span
          className={cn(
            'flex h-[18px] w-[18px] items-center justify-center rounded border border-stroke-divider bg-transparent transition-colors',
            checked && 'border-primary bg-primary'
          )}
        >
          <Check
            className={cn(
              'h-3 w-3 text-white transition-transform',
              checked ? 'scale-100' : 'scale-0'
            )}
          />
        </span>
      </span>
      {typeof label === 'string' ? <span>{label}</span> : label}
    </label>
  );
}

function FilterSearchInput({ value, onChange }) {
  return (
    <Input
      size="sm"
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      leftIcon={Search}
      className="mb-4"
      inputClassName="text-sm"
    />
  );
}

function CheckboxFilterPanel({
  options,
  selected,
  onToggle,
  onSelectionChange,
  searchQuery,
  onSearchChange,
  showSelectAll = false,
}) {
  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => String(opt).toLowerCase().includes(q));
  }, [options, searchQuery]);

  const allFilteredSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => selected.includes(opt));

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      onSelectionChange(selected.filter((item) => !filteredOptions.includes(item)));
      return;
    }
    onSelectionChange([...new Set([...selected, ...filteredOptions])]);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <FilterSearchInput value={searchQuery} onChange={onSearchChange} />
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
        {showSelectAll && filteredOptions.length > 0 && (
          <FilterCheckbox
            checked={allFilteredSelected}
            onChange={handleSelectAll}
            label="Select All"
            className="font-medium"
          />
        )}
        {filteredOptions.map((option) => (
          <FilterCheckbox
            key={option}
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            label={option}
          />
        ))}
        {filteredOptions.length === 0 && (
          <p className="py-8 text-center text-sm text-paragraph/60">No options found</p>
        )}
      </div>
    </div>
  );
}

function RatingFilterPanel({ selected, onToggle }) {
  return (
    <div className="flex flex-col gap-1">
      {FILTER_OPTIONS.rating.map((stars) => (
        <FilterCheckbox
          key={stars}
          checked={selected.includes(stars)}
          onChange={() => onToggle(stars)}
          label={<StarRating value={stars} iconClassName="h-4 w-4" />}
        />
      ))}
    </div>
  );
}

export const UniverseFiltersModal = ({
  open,
  onOpenChange,
  appliedFilters,
  onApply,
  onClear,
}) => {
  const [activeCategory, setActiveCategory] = useState('category');
  const [tempFilters, setTempFilters] = useState(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      setTempFilters(appliedFilters ?? DEFAULT_FILTERS);
    }
  }, [open, appliedFilters]);

  useEffect(() => {
    setSearchQuery('');
  }, [activeCategory]);

  const filterKey = FILTER_STATE_KEYS[activeCategory];

  const toggleOption = (option) => {
    if (!filterKey) return;
    setTempFilters((prev) => {
      const current = prev[filterKey] ?? [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [filterKey]: next };
    });
  };

  const setFilterSelection = (values) => {
    if (!filterKey) return;
    setTempFilters((prev) => ({ ...prev, [filterKey]: values }));
  };

  const handleApply = () => {
    onApply?.(tempFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setTempFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    onClear?.();
  };

  const activeLabel = FILTER_CATEGORIES.find((c) => c.id === activeCategory)?.label;

  const renderCategoryContent = () => {
    if (activeCategory === 'category') {
      return (
        <RadioGroup
          value={tempFilters.category}
          onValueChange={(v) => setTempFilters((prev) => ({ ...prev, category: v }))}
          className="gap-4"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="growth" id="growth" />
            <label htmlFor="growth" className="cursor-pointer text-[15px] text-heading">
              Growth
            </label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="dividend" id="dividend" />
            <label htmlFor="dividend" className="cursor-pointer text-[15px] text-heading">
              Dividend
            </label>
          </div>
        </RadioGroup>
      );
    }

    if (activeCategory === 'rating') {
      return (
        <RatingFilterPanel
          selected={tempFilters.rating}
          onToggle={toggleOption}
        />
      );
    }

    if (SEARCHABLE_CATEGORIES.has(activeCategory)) {
      const options = FILTER_OPTIONS[activeCategory] ?? [];
      const selected = tempFilters[filterKey] ?? [];
      const showSelectAll =
        activeCategory === 'fund-house' || activeCategory === 'fund-manager';

      return (
        <CheckboxFilterPanel
          options={options}
          selected={selected}
          onToggle={toggleOption}
          onSelectionChange={setFilterSelection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSelectAll={showSelectAll}
        />
      );
    }

    return null;
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      className="max-w-[800px] h-[540px] overflow-hidden rounded-xl"
      contentClassName="p-0 flex flex-col h-full"
    >
      <div className="flex items-center justify-between border-b border-stroke-divider px-6 py-4">
        <h2 className="text-xl font-bold text-heading">Advanced filters</h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[240px] shrink-0 border-r border-stroke-divider bg-sidebar/50">
          <div className="flex flex-col py-2">
            {FILTER_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'px-6 py-4 text-left text-[15px] font-medium transition-colors',
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'text-paragraph hover:bg-white/5'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-6">
          <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-stroke-divider bg-layer2 p-6">
            <h3 className="mb-4 shrink-0 text-lg font-semibold text-heading">{activeLabel}</h3>
            <div className="flex min-h-0 flex-1 flex-col">{renderCategoryContent()}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-stroke-divider bg-layer1 px-6 py-4">
        <Button
          variant="outline"
          onClick={handleClear}
          className="min-w-[100px] border-stroke-divider bg-transparent font-medium hover:bg-white/5"
        >
          Clear All
        </Button>
        <Button onClick={handleApply} className="min-w-[100px] font-medium">
          Apply
        </Button>
      </div>
    </Modal>
  );
};
