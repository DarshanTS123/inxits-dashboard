import { Pagination } from '@components/ui/Pagination/Pagination';
import { Tabs, TabsContent } from '@components/ui/Tabs/Tabs';

import { ClientsHeader } from './components/ClientsHeader';
import { ClientsTable } from './components/ClientsTable';
import { useClientsManager } from './hooks/useClientsManager';

export const Clients = () => {
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

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <ClientsHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={counts}
        searchColumn={searchColumn}
        onSearchColumnChange={setSearchColumn}
        query={query}
        onQueryChange={handleQueryChange}
      />

      <div className="rounded-xl border border-stroke-divider bg-layer1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsContent value={activeTab} className="p-0">
            <ClientsTable data={clients} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

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
  );
};
