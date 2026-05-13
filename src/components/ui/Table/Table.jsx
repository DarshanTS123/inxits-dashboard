import React from 'react';

import { cn } from '@/utils/cn';

function normalizeStickyColumns(stickyColumns, stickyColumn) {
  if (stickyColumns) return stickyColumns;

  if (stickyColumn === true || stickyColumn === 'first') {
    return { left: [{ index: 0, width: 0 }] };
  }

  if (stickyColumn === 'last') {
    return { right: [{ index: -1, width: 0 }] };
  }

  return null;
}

function columnSelector(index) {
  if (index < 0) return `nth-last-child(${Math.abs(index)})`;
  return `nth-child(${index + 1})`;
}

function buildStickyColumnStyles(scopeClassName, stickyColumns) {
  if (!stickyColumns) return '';

  const rules = [];

  const addRules = (side, columns = []) => {
    let offset = 0;

    columns.forEach((column) => {
      const config = typeof column === 'number' ? { index: column, width: 0 } : column;
      const selector = `.${scopeClassName} tr > *:${columnSelector(config.index)}`;
      const borderSide = side === 'left' ? 'border-right' : 'border-left';

      rules.push(`
        ${selector} {
          position: sticky;
          ${side}: ${offset}px;
          z-index: 20;
          background: var(--bg-helper);
          ${borderSide}: 1px solid var(--stroke-divider);
        }

        .${scopeClassName} thead tr > *:${columnSelector(config.index)} {
          z-index: 40;
          background: var(--bg-helper);
        }

        .${scopeClassName} tbody tr:hover > *:${columnSelector(config.index)} {
          background: #303244;
        }
      `);

      offset += Number(config.width || 0);
    });
  };

  addRules('left', stickyColumns.left);
  addRules('right', stickyColumns.right);

  return rules.join('\n');
}

function Table({
  className,
  containerClassName,
  stickyColumns,
  stickyColumn = false,
  style,
  ...props
}) {
  const tableId = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const scopeClassName = `table-${tableId}`;
  const normalizedStickyColumns = normalizeStickyColumns(stickyColumns, stickyColumn);
  const stickyColumnStyles = buildStickyColumnStyles(scopeClassName, normalizedStickyColumns);

  return (
    <div
      className={cn('relative w-full overflow-x-auto custom-scrollbar', containerClassName)}
      style={style}
    >
      {stickyColumnStyles ? <style>{stickyColumnStyles}</style> : null}
      <table
        className={cn(
          'w-full caption-bottom border-separate border-spacing-0 text-sm',
          scopeClassName,
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return <thead className={cn('[&_tr]:border-b [&_tr]:border-stroke-divider', className)} {...props} />;
}

function TableBody({ className, ...props }) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        'border-b border-stroke-divider transition-colors hover:bg-layer1/60 data-[selected=true]:bg-layer1',
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, sticky, stickyOffset = 0, style, ...props }) {
  return (
    <th
      className={cn(
        'h-11 border-b border-stroke-divider px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-subheading',
        sticky === 'left' &&
          'sticky left-[var(--table-cell-sticky-offset)] z-40 border-r border-stroke-divider bg-helper',
        sticky === 'right' &&
          'sticky right-[var(--table-cell-sticky-offset)] z-40 border-l border-stroke-divider bg-helper',
        className
      )}
      style={{ '--table-cell-sticky-offset': `${stickyOffset}px`, ...style }}
      {...props}
    />
  );
}

function TableCell({ className, sticky, stickyOffset = 0, style, ...props }) {
  return (
    <td
      className={cn(
        'border-b border-stroke-divider px-4 py-3 align-middle text-sm text-paragraph',
        sticky === 'left' &&
          'sticky left-[var(--table-cell-sticky-offset)] z-20 border-r border-stroke-divider bg-helper',
        sticky === 'right' &&
          'sticky right-[var(--table-cell-sticky-offset)] z-20 border-l border-stroke-divider bg-helper',
        className
      )}
      style={{ '--table-cell-sticky-offset': `${stickyOffset}px`, ...style }}
      {...props}
    />
  );
}

function DataTable({
  columns,
  data,
  getRowKey,
  emptyMessage = 'No records found.',
  stickyColumns,
  stickyColumn,
  className,
  containerClassName,
  tableClassName,
  rowClassName,
}) {
  const visibleColumns = columns.filter((column) => column.hidden !== true);
  const colSpan = Math.max(visibleColumns.length, 1);

  return (
    <Table
      stickyColumns={stickyColumns}
      stickyColumn={stickyColumn}
      className={tableClassName}
      containerClassName={containerClassName}
    >
      <TableHeader>
        <TableRow>
          {visibleColumns.map((column) => (
            <TableHead
              key={column.id || column.accessorKey}
              className={cn(column.headerClassName, column.className)}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody className={className}>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-paragraph">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIndex) => (
            <TableRow
              key={getRowKey ? getRowKey(row, rowIndex) : row.id || rowIndex}
              className={typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName}
            >
              {visibleColumns.map((column) => {
                const value = column.accessorKey ? row[column.accessorKey] : undefined;

                return (
                  <TableCell
                    key={column.id || column.accessorKey}
                    className={cn(column.cellClassName, column.className)}
                  >
                    {column.cell ? column.cell({ row, value, rowIndex, column }) : value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export { DataTable, Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
