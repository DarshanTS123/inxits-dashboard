import { Settings } from 'lucide-react';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Button } from '@/components/ui/Button/Button';

export const TransactionHeader = ({ dateRange, onDateRangeChange }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-semibold text-heading">Transactions</h1>

      <div className="flex items-center gap-2">
        <DatePicker
          mode="range"
          value={dateRange}
          onChange={onDateRangeChange}
          triggerClassName="h-12 w-full text-base hover:bg-layer2 sm:w-auto"
        />
        <Button
          type="button"
          variant="outline"
          leftIcon={Settings}
          size="lg"
        >
          Settings
        </Button>
      </div>
    </div>
  );
};
