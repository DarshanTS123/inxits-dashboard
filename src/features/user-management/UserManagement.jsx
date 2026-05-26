import { useNavigate } from 'react-router-dom';

import { PageLoader } from '@components/ui/PageLoader';
import { Pagination } from '@components/ui/Pagination/Pagination';
import { Button } from '@components/ui/Button/Button';

import { UserManagementHeader } from './components/UserManagementHeader';
import { UserManagementTable } from './components/UserManagementTable';
import { useUserManagement } from './hooks/useUserManagement';

export const UserManagement = () => {
  const navigate = useNavigate();
  const {
    users,
    totalCount,
    isLoading,
    error,
    refetch,
    query,
    handleQueryChange,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
  } = useUserManagement();

  if (isLoading && totalCount === 0 && !query) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-stroke-divider bg-layer1 p-8 text-center">
        <p className="text-base text-paragraph">
          Unable to load users. Please try again.
        </p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-heading">Listing</h2>
        <UserManagementHeader
          query={query}
          onQueryChange={handleQueryChange}
          onNewUser={() => navigate('/user-management/new')}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
        <UserManagementTable
          data={users}
          isLoading={isLoading}
          onEdit={(user) => navigate(`/user-management/${user.id}/edit`)}
        />

        <div className="border-t border-stroke-divider bg-table-footer p-3">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={totalCount}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[8, 10, 25, 50]}
          />
        </div>
      </div>
    </div>
  );
};
