import { useMemo, useState } from 'react';

import { Pagination } from '@components/ui/Pagination/Pagination';
import { Tabs } from '@components/ui/Tabs/Tabs';

import { ClientsHeader } from './components/ClientsHeader';
import { ClientsTable } from './components/ClientsTable';
import { CreateClientDrawer } from './components/CreateClientDrawer';
import { CLIENT_LIST_TABS } from './constants/clientTabs';
import { useClientsManager } from './hooks/useClientsManager';

export const Clients = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const {
    clients,
    totalCount,
    counts,
    isLoading,
    activeTab,
    handleTabChange,
    searchColumn,
    setSearchColumn,
    query,
    handleQueryChange,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
  } = useClientsManager();

  const tabItems = useMemo(
    () =>
      CLIENT_LIST_TABS.map((tab) => ({
        value: tab.value,
        label: tab.label,
        badge: counts[tab.value] ?? counts.all,
      })),
    [counts]
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        items={tabItems}
        contentClassName="p-0"
        listClassName="mb-4 flex-wrap"
      >
        <div className="space-y-4">
          <ClientsHeader
            searchColumn={searchColumn}
            onSearchColumnChange={setSearchColumn}
            query={query}
            onQueryChange={handleQueryChange}
            onAddClient={() => setIsCreateDrawerOpen(true)}
          />

          <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
            <ClientsTable data={clients} isLoading={isLoading} />

            <div className="border-t border-stroke-divider bg-layer1 p-3">
              <Pagination
                page={page}
                pageSize={pageSize}
                total={totalCount}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[5, 10, 25, 50, 100]}
              />
            </div>
          </div>
        </div>
      </Tabs>

      <CreateClientDrawer
        open={isCreateDrawerOpen}
        onOpenChange={setIsCreateDrawerOpen}
      />
    </div>
  );
};
