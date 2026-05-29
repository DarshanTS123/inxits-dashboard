import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import { cn } from '@/utils/cn';

// ─── Static Data ──────────────────────────────────────────────────────────────

const FUND_HOUSES = [
  '360 ONE Mutual Fund',
  'Aditya Birla Sun Life Mutual Fund',
  'Axis Mutual Fund',
  'Bajaj Finserv Mutual Fund',
  'Bank of India Mutual Fund',
  'Canara Robeco Mutual Fund',
  'DSP Mutual Fund',
  'Franklin Templeton Mutual Fund',
  'HDFC Mutual Fund',
  'ICICI Prudential Mutual Fund',
  'Kotak Mahindra Mutual Fund',
  'L&T Mutual Fund',
  'Mirae Asset Mutual Fund',
  'Motilal Oswal Mutual Fund',
  'Nippon India Mutual Fund',
  'PGIM India Mutual Fund',
  'SBI Mutual Fund',
  'Tata Mutual Fund',
  'Union Mutual Fund',
  'UTI Mutual Fund',
];

const AMC_SCHEMES = [
  'Nippon India Banking & Fin Srvs Gr',
  'Bandhan Gov Sec Inv Reg Gr',
  'HDFC Gold ETF',
  'Axis Mutual Fund - Large Cap',
  'ICICI Prudential Equity Fund',
  'SBI Balanced Advantage Fund',
  'Mirae Asset Emerging Bluechip',
  'Kotak Flexi Cap Fund',
  'DSP Midcap Fund',
  'Motilal Oswal Flexi Cap Fund',
  'UTI Nifty 50 Index Fund',
  'Franklin India Prima Fund',
  'Canara Robeco Equity Hybrid',
  'Tata Digital India Fund',
  'PGIM India Midcap Opp Fund',
  'Aditya Birla SL Frontline Equity',
];

/** Pre-defined AUM range buckets shown as checkbox options */
export const AUM_RANGES = [
  { label: '₹0 - ₹20Lac', min: 0, max: 2_000_000 },
  { label: '₹21Lac - ₹40Lac', min: 2_100_000, max: 4_000_000 },
  { label: '₹41Lac - ₹60Lac', min: 4_100_000, max: 6_000_000 },
  { label: '₹61Lac - ₹80Lac', min: 6_100_000, max: 8_000_000 },
  { label: '₹81Lac - ₹1Cr+', min: 8_100_000, max: Infinity },
];

const FILTER_CATEGORIES = [
  { id: 'fundHouse', label: 'Fund House' },
  { id: 'amc', label: 'AMC' },
  { id: 'aum', label: 'AUM' },
];

export const DEFAULT_FILTERS = {
  selectedFundHouses: [],
  selectedAMCSchemes: [],
  selectedAUMRanges: [],
};

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Square checkbox row matching the design reference */
function CheckboxRow({ checked, indeterminate = false, onChange, label }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center gap-3 rounded-sm px-1 py-2.5 text-left transition-colors hover:bg-white/5"
    >
      <span
        className={cn(
          'relative flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-sm border transition-colors',
          checked || indeterminate
            ? 'border-primary bg-primary'
            : 'border-stroke-divider bg-transparent'
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 10" fill="none" className="h-2.5 w-2.5">
            <path
              d="M1 5L4.5 8.5L11 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {!checked && indeterminate && (
          <span className="h-0.5 w-2.5 rounded-full bg-white" />
        )}
      </span>
      <span className="text-sm leading-tight text-paragraph">{label}</span>
    </button>
  );
}

/** Reusable panel: title + search + Select All + scrollable checkbox list */
function CheckboxListPanel({ title, items, selected, onToggle, onSelectAll, onDeselectAll, search, onSearchChange }) {
  const filtered = useMemo(
    () => items.filter((item) => item.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const allSelected = filtered.length > 0 && filtered.every((i) => selected.includes(i));
  const someSelected = !allSelected && filtered.some((i) => selected.includes(i));

  const handleSelectAll = () => {
    if (allSelected) {
      onDeselectAll(filtered);
    } else {
      onSelectAll(filtered);
    }
  };

  return (
    <>
      <h3 className="mb-3 text-base font-semibold text-heading">{title}</h3>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-disabled" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-stroke-divider bg-layer2 py-2.5 pl-9 pr-4 text-sm text-heading placeholder:text-text-disabled outline-none transition-colors focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
        <CheckboxRow
          checked={allSelected}
          indeterminate={someSelected}
          onChange={handleSelectAll}
          label={<span className="font-medium text-text-label">Select All</span>}
        />
        <div className="my-1 h-px bg-stroke-divider opacity-40" />

        {filtered.map((item) => (
          <CheckboxRow
            key={item}
            checked={selected.includes(item)}
            onChange={() => onToggle(item)}
            label={item}
          />
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-text-disabled">
            No results found.
          </p>
        )}
      </div>
    </>
  );
}

// ─── AUM Range Panel (no search — fixed buckets) ──────────────────────────────

function AUMRangePanel({ selected, onToggle }) {
  const allSelected = AUM_RANGES.every((r) => selected.includes(r.label));
  const someSelected = !allSelected && AUM_RANGES.some((r) => selected.includes(r.label));

  const handleSelectAll = () => {
    if (allSelected) {
      // deselect all
      AUM_RANGES.forEach((r) => {
        if (selected.includes(r.label)) onToggle(r.label);
      });
    } else {
      // select all missing
      AUM_RANGES.forEach((r) => {
        if (!selected.includes(r.label)) onToggle(r.label);
      });
    }
  };

  return (
    <>
      <h3 className="mb-3 text-base font-semibold text-heading">AUM</h3>

      {/* Intentionally no search — there are only 5 fixed buckets */}
      <div className="flex-1 space-y-0.5 overflow-y-auto pr-1 custom-scrollbar">
        <CheckboxRow
          checked={allSelected}
          indeterminate={someSelected}
          onChange={handleSelectAll}
          label={<span className="font-medium text-text-label">Select All</span>}
        />
        <div className="my-1 h-px bg-stroke-divider opacity-40" />

        {AUM_RANGES.map((range) => (
          <CheckboxRow
            key={range.label}
            checked={selected.includes(range.label)}
            onChange={() => onToggle(range.label)}
            label={range.label}
          />
        ))}
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const AUMFilterModal = ({
  open,
  onOpenChange,
  appliedFilters,
  onApply,
  onClear,
}) => {
  // State is initialized from appliedFilters at mount.
  // Parent passes key={String(open)} to remount on each open cycle,
  // so this useState re-runs naturally — no useEffect cascade needed.
  const [tempFilters, setTempFilters] = useState(appliedFilters);
  const [activeCategory, setActiveCategory] = useState('fundHouse');

  // Per-panel search states
  const [fundHouseSearch, setFundHouseSearch] = useState('');
  const [amcSearch, setAmcSearch] = useState('');

  // ── Generic toggle helpers ──────────────────────────────────────────────────

  const makeToggle = (key) => (value) => {
    setTempFilters((prev) => {
      const arr = prev[key] ?? [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const makeSelectAll = (key) => (items) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: Array.from(new Set([...(prev[key] ?? []), ...items])),
    }));
  };

  const makeDeselectAll = (key) => (items) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((v) => !items.includes(v)),
    }));
  };

  const handleApply = () => {
    onApply(tempFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setTempFilters(DEFAULT_FILTERS);
    onClear();
    onOpenChange(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      className="max-w-[780px] h-[560px] overflow-hidden rounded-xl"
      contentClassName="p-0 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-shrink-0 items-center border-b border-stroke-divider px-6 py-4">
        <h2 className="text-lg font-bold text-heading">Filters</h2>
      </div>

      {/* Two-panel body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar — category navigation */}
        <div className="w-44 flex-shrink-0 border-r border-stroke-divider bg-page">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'w-full px-5 py-4 text-left text-sm font-medium transition-colors',
                activeCategory === cat.id
                  ? 'bg-primary font-semibold text-white'
                  : 'text-paragraph hover:bg-white/5'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right content panel */}
        <div className="flex flex-1 flex-col overflow-hidden bg-layer1 p-5">
          {activeCategory === 'fundHouse' && (
            <CheckboxListPanel
              title="Fund House"
              items={FUND_HOUSES}
              selected={tempFilters.selectedFundHouses ?? []}
              onToggle={makeToggle('selectedFundHouses')}
              onSelectAll={makeSelectAll('selectedFundHouses')}
              onDeselectAll={makeDeselectAll('selectedFundHouses')}
              search={fundHouseSearch}
              onSearchChange={setFundHouseSearch}
            />
          )}

          {activeCategory === 'amc' && (
            <CheckboxListPanel
              title="AMC"
              items={AMC_SCHEMES}
              selected={tempFilters.selectedAMCSchemes ?? []}
              onToggle={makeToggle('selectedAMCSchemes')}
              onSelectAll={makeSelectAll('selectedAMCSchemes')}
              onDeselectAll={makeDeselectAll('selectedAMCSchemes')}
              search={amcSearch}
              onSearchChange={setAmcSearch}
            />
          )}

          {activeCategory === 'aum' && (
            <AUMRangePanel
              selected={tempFilters.selectedAUMRanges ?? []}
              onToggle={makeToggle('selectedAUMRanges')}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-stroke-divider bg-page px-6 py-4">
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
