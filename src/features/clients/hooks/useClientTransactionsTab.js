import { useMemo, useState } from 'react';

import { apiDateRangeToPicker, pickerRangeToApiDateRange } from '@/utils/date';
import {
  filterTransactions,
  groupTransactionsByDate,
} from '../utils/clientTransactions';

export const useClientTransactionsTab = (transactionsTab) => {
  const [activeType, setActiveType] = useState(
    transactionsTab?.typeFilters?.[0]?.value ?? 'sip'
  );
  const [dateRange, setDateRange] = useState(
    () => transactionsTab?.dateRange ?? null
  );

  const dateRangeValue = useMemo(
    () => apiDateRangeToPicker(dateRange),
    [dateRange]
  );

  const handleDateRangeChange = (range) => {
    setDateRange(pickerRangeToApiDateRange(range));
  };

  const filteredGroups = useMemo(() => {
    if (!transactionsTab?.items?.length) return [];

    const filtered = filterTransactions(transactionsTab.items, {
      type: activeType,
      dateRange,
    });

    return groupTransactionsByDate(filtered);
  }, [activeType, dateRange, transactionsTab]);

  return {
    activeType,
    setActiveType,
    dateRangeValue,
    onDateRangeChange: handleDateRangeChange,
    filteredGroups,
    lastTransactionDate: transactionsTab?.lastTransactionDate ?? '-',
    typeFilters: transactionsTab?.typeFilters ?? [],
    isEmpty: filteredGroups.length === 0,
  };
};
