import { Plus, Search } from 'lucide-react';

import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';
import { Select } from '@components/ui/Select/Select';

export const ClientsHeader = ({
  searchColumn,
  onSearchColumnChange,
  query,
  onQueryChange,
  onAddClient,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-[180px]">
          <Select
            value={searchColumn}
            onValueChange={onSearchColumnChange}
            placeholder="All Columns"
            triggerClassName="h-10"
            options={[
              { label: 'All Columns', value: 'all' },
              { label: 'Client Name', value: 'clientName' },
              { label: 'Email ID', value: 'email' },
              { label: 'PAN Number', value: 'pan' },
              { label: 'RM Assigned', value: 'rm' },
            ]}
          />
        </div>

        <div className="w-full sm:max-w-[420px]">
          <Input
            size="sm"
            placeholder="Search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            leftIcon={Search}
            className="h-10"
          />
        </div>
      </div>

      <Button
        type="button"
        leftIcon={Plus}
        className="h-10 shrink-0"
        onClick={onAddClient}
      >
        Add Client
      </Button>
    </div>
  );
};
