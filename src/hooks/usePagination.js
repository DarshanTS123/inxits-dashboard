import { useState, useMemo } from 'react';

/**
 * A reusable hook for managing client-side pagination.
 * 
 * @param {Array} data - The full array of items to paginate.
 * @param {number} initialPageSize - The number of items per page.
 * @returns {Object} Pagination state and handlers.
 */
export const usePagination = (data = [], initialPageSize = 10) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalCount = data.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  
  // Ensure the current page doesn't exceed the total number of pages
  const currentPage = Math.min(page, pageCount);

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return data.slice(startIdx, startIdx + pageSize);
  }, [data, currentPage, pageSize]);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const resetPage = () => setPage(1);

  return {
    page: currentPage,
    setPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    pageCount,
    totalCount,
    paginatedData,
    resetPage,
  };
};
