export const DEFAULT_FILTERS = {
  category: 'growth',
  equity: [],
  debt: [],
  hybrid: [],
  others: [],
  rating: [],
  fundHouse: [],
  fundManager: [],
};

const CATEGORY_LABELS = {
  growth: 'Growth',
  dividend: 'Dividend',
};

const ARRAY_FILTER_KEYS = [
  { key: 'equity', prefix: 'equity' },
  { key: 'debt', prefix: 'debt' },
  { key: 'hybrid', prefix: 'hybrid' },
  { key: 'others', prefix: 'others' },
  { key: 'fundHouse', prefix: 'fund-house' },
  { key: 'fundManager', prefix: 'fund-manager' },
];

export function isDefaultFilters(filters) {
  return (
    filters.category === DEFAULT_FILTERS.category &&
    ARRAY_FILTER_KEYS.every(({ key }) => (filters[key] ?? []).length === 0) &&
    (filters.rating ?? []).length === 0
  );
}

export function getFilterChips(filters) {
  const chips = [];

  if (filters.category) {
    chips.push({
      id: `category-${filters.category}`,
      label: CATEGORY_LABELS[filters.category] ?? filters.category,
      filterKey: 'category',
      value: filters.category,
    });
  }

  for (const { key, prefix } of ARRAY_FILTER_KEYS) {
    for (const value of filters[key] ?? []) {
      chips.push({
        id: `${prefix}-${value}`,
        label: String(value),
        filterKey: key,
        value,
      });
    }
  }

  for (const stars of filters.rating ?? []) {
    chips.push({
      id: `rating-${stars}`,
      label: `${stars} Star${stars === 1 ? '' : 's'}`,
      filterKey: 'rating',
      value: stars,
    });
  }

  return chips;
}

export function removeFilterChip(filters, chip) {
  if (chip.filterKey === 'category') {
    return { ...filters, category: DEFAULT_FILTERS.category };
  }

  const current = filters[chip.filterKey] ?? [];
  return {
    ...filters,
    [chip.filterKey]: current.filter((item) => item !== chip.value),
  };
}
