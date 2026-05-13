import { Plus, Search } from 'lucide-react';

import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/Select/Select';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/Tabs/Tabs';

const TABS = [
  { key: 'all', label: 'All Clients' },
  { key: 'invited', label: 'Invited Clients' },
  { key: 'ageing', label: 'Ageing' },
  { key: 'inactive', label: 'Inactive Clients' },
];

export const ClientsHeader = ({
  activeTab,
  onTabChange,
  counts,
  searchColumn,
  onSearchColumnChange,
  query,
  onQueryChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            {TABS.map((t) => {
              const count = counts[t.key] ?? counts.all;
              return (
                <TabsTrigger key={t.key} value={t.key}>
                  <span className="text-sm font-semibold">{t.label}</span>
                  <span data-slot="tabs-badge">{count}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-[180px]">
            <Select value={searchColumn} onValueChange={onSearchColumnChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Columns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Columns</SelectItem>
                <SelectItem value="clientName">Client Name</SelectItem>
                <SelectItem value="email">Email ID</SelectItem>
                <SelectItem value="pan">PAN Number</SelectItem>
                <SelectItem value="rm">RM Assigned</SelectItem>
              </SelectContent>
            </Select>
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

        <Button type="button" leftIcon={Plus} className="h-10 shrink-0">
          Add Client
        </Button>
      </div>
    </div>
  );
};
