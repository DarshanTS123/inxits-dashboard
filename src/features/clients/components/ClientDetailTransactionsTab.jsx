import { useState } from 'react';
import { ArrowLeftRight, ChevronDown, ChevronRight, Download } from 'lucide-react';

import { Button } from '@components/ui/Button/Button';
import { DatePicker } from '@components/ui/DatePicker/DatePicker';
import { DropdownMenuList } from '@components/ui/DropdownMenu/DropdownMenu';
import { cn } from '@utils/cn';
import { CreateTransactionDrawer } from './CreateTransactionDrawer';
import { useClientTransactionsTab } from '../hooks/useClientTransactionsTab';
import { getTransactionStatusStyles } from '../utils/clientTransactions';

const DOWNLOAD_ITEMS = [
  { id: 'pdf', label: 'Download PDF' },
  { id: 'csv', label: 'Download CSV' },
  { id: 'xlsx', label: 'Download Excel' },
];

const TransactionStatus = ({ status }) => {
  const styles = getTransactionStatusStyles(status);

  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className={cn('h-2 w-2 rounded-full', styles.dot)} aria-hidden />
      <span className={cn('text-[13px] font-medium', styles.text)}>{status}</span>
    </div>
  );
};

const TransactionRow = ({ transaction }) => (
  <button
    type="button"
    className="flex w-full items-center gap-4 rounded-xl border border-stroke-divider bg-layer1 px-5 py-[18px] text-left transition-colors hover:bg-table-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    aria-label={`View ${transaction.schemeName} transaction`}
  >
    <div className="min-w-0 flex-1">
      <p className="text-[15px] font-semibold leading-snug text-heading">
        {transaction.schemeName}
      </p>
      <p className="mt-1.5 text-[13px] text-paragraph/80">
        <span className="font-semibold text-heading">{transaction.amount}</span>{' '}
        <span className="font-normal">({transaction.typeLabel})</span>
      </p>
    </div>

    <div className="shrink-0">
      <TransactionStatus status={transaction.status} />
    </div>

    <ChevronRight className="h-5 w-5 shrink-0 text-paragraph/60" aria-hidden />
  </button>
);

const TypeFilterPills = ({ filters, activeType, onChange }) => (
  <div
    className="flex flex-wrap items-center gap-2.5"
    role="group"
    aria-label="Transaction type filters"
  >
    {filters.map((filter) => {
      const isActive = filter.value === activeType;

      return (
        <Button
          key={filter.value}
          type="button"
          variant="outline"
          aria-pressed={isActive}
          className={cn(
            'h-8 rounded-full px-5 py-0 text-xs font-normal',
            isActive
              ? 'border-primary text-primary hover:bg-transparent hover:text-primary'
              : 'border-stroke-divider text-heading hover:bg-transparent hover:text-heading'
          )}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </Button>
      );
    })}
  </div>
);

export const ClientDetailTransactionsTab = ({ transactionsTab }) => {
  const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false);
  const {
    activeType,
    setActiveType,
    filteredGroups,
    lastTransactionDate,
    dateRangeValue,
    onDateRangeChange,
    typeFilters,
    isEmpty,
  } = useClientTransactionsTab(transactionsTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] italic text-paragraph">
          Last Transaction as on {lastTransactionDate}.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenuList
            variant="dark"
            trigger={
              <Button
                type="button"
                variant="outline"
                leftIcon={Download}
                rightIcon={ChevronDown}
                className="h-9 gap-2 px-4 text-xs font-medium text-heading"
              >
                Download
              </Button>
            }
            items={DOWNLOAD_ITEMS.map((item) => ({
              ...item,
              onSelect: () => {},
            }))}
          />

          <Button
            type="button"
            className="h-9 px-5 text-sm font-semibold"
            onClick={() => setIsCreateTransactionOpen(true)}
          >
            Create Transaction
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <TypeFilterPills
          filters={typeFilters}
          activeType={activeType}
          onChange={setActiveType}
        />

        <DatePicker
          mode="range"
          value={dateRangeValue}
          onChange={onDateRangeChange}
          align="end"
          triggerClassName="h-9 w-full sm:w-auto sm:min-w-[220px]"
        />
      </div>

      {isEmpty ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border border-stroke-divider bg-layer1 p-8 text-center">
          <ArrowLeftRight className="h-8 w-8 text-paragraph/50" aria-hidden />
          <p className="text-sm font-medium text-heading">No transactions found</p>
          <p className="max-w-sm text-[12px] text-paragraph/70">
            Try changing the transaction type or date range to see more results.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <section key={group.dateKey} aria-labelledby={`tx-group-${group.dateKey}`}>
              <h3
                id={`tx-group-${group.dateKey}`}
                className="mb-4 text-[15px] font-semibold text-heading"
              >
                {group.label}
              </h3>
              <div className="space-y-3">
                {group.items.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <CreateTransactionDrawer
        open={isCreateTransactionOpen}
        onOpenChange={setIsCreateTransactionOpen}
      />
    </div>
  );
};
