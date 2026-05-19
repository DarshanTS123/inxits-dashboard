import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button/Button';
import { Select } from '@/components/ui/Select/Select';

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function getPageCount(total, pageSize) {
  return Math.max(1, Math.ceil(total / pageSize));
}

function usePageWindow({ page, pageCount, windowSize = 5 }) {
  return useMemo(() => {
    const half = Math.floor(windowSize / 2);
    let start = clamp(page - half, 1, Math.max(1, pageCount - windowSize + 1));
    let end = Math.min(pageCount, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);

    const pages = [];
    for (let p = start; p <= end; p += 1) pages.push(p);
    return { pages, start, end };
  }, [page, pageCount, windowSize]);
}

export function Pagination({
  className,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
}) {
  const pageCount = getPageCount(total, pageSize);
  const safePage = clamp(page, 1, pageCount);
  const { pages } = usePageWindow({ page: safePage, pageCount, windowSize: 5 });

  const startRow = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRow = Math.min(total, safePage * pageSize);

  const canPrev = safePage > 1;
  const canNext = safePage < pageCount;
  const paginationButtonClass = cn(
    'inline-flex h-10 w-10 items-center justify-center rounded-md border border-stroke-divider bg-layer1 text-paragraph transition',
    'hover:border-white/25 hover:bg-layer2 hover:text-heading',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25',
    'disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-stroke-divider disabled:hover:bg-layer1 disabled:hover:text-paragraph'
  );

  return (
    <div
      className={cn(
        'grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]',
        className
      )}
    >
      <div className="justify-self-start px-2 text-sm font-semibold text-heading">
        {startRow}-{endRow} of {total} rows
      </div>

      <div className="flex items-center justify-center gap-1.5 justify-self-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canPrev}
          aria-label="First page"
          onClick={() => onPageChange?.(1)}
          className={cn(paginationButtonClass, 'p-0')}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canPrev}
          aria-label="Previous page"
          onClick={() => onPageChange?.(safePage - 1)}
          className={cn(paginationButtonClass, 'p-0')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((p) => {
            const isActive = p === safePage;
            return (
              <Button
                key={p}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onPageChange?.(p)}
                className={cn(
                  'h-10 w-10 rounded-md border p-0 text-sm font-semibold',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25',
                  isActive
                    ? 'border-primary bg-btn-primary text-text-on-primary shadow-[0_0_0_1px_rgba(30,122,176,0.18)]'
                    : 'border-stroke-divider bg-layer1 text-paragraph hover:border-white/25 hover:bg-layer2 hover:text-heading'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {p}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canNext}
          aria-label="Next page"
          onClick={() => onPageChange?.(safePage + 1)}
          className={cn(paginationButtonClass, 'p-0')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canNext}
          aria-label="Last page"
          onClick={() => onPageChange?.(pageCount)}
          className={cn(paginationButtonClass, 'p-0')}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full justify-self-end sm:w-[128px]">
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange?.(Number(v))}
          placeholder="Rows per page"
          triggerClassName="h-9 rounded-md bg-layer1 px-3 text-xs font-medium text-heading"
          align="end"
          options={pageSizeOptions.map((opt) => ({
            label: `${opt} per page`,
            value: String(opt),
          }))}
        />

      </div>
    </div>
  );
}
