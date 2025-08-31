import React, { useEffect, useMemo, useRef, useState } from 'react';

// Column definition tied to the row type T
export interface Column<T extends Record<string, any>> {
  key: string; // unique key for the column
  title: string;
  dataIndex: keyof T; // which property to read from the row
  sortable?: boolean;
}

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean; // multiple selection with checkboxes when true
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
  emptyText?: string;
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  const ta = typeof a;
  const tb = typeof b;

  if (ta === 'number' && tb === 'number') return (a as number) - (b as number);
  if (ta === 'boolean' && tb === 'boolean') return Number(a) - Number(b);

  // Compare dates if both are Date objects
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();

  // Fallback to string compare
  return String(a).localeCompare(String(b));
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  className = '',
  emptyText = 'No data',
}: DataTableProps<T>) {
  type SortOrder = 'asc' | 'desc';
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Track selected rows by original index to remain stable across sorting
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Build rows with original index, then sort when needed
  const rows = useMemo(() => {
    const withIndex = data.map((row, idx) => ({ row, originalIndex: idx }));
    if (!sortKey) return withIndex;
    const sorted = [...withIndex].sort((a, b) => {
      const va = a.row[sortKey!];
      const vb = b.row[sortKey!];
      const cmp = compareValues(va, vb);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [data, sortKey, sortOrder]);

  // Notify parent of selection changes
  useEffect(() => {
    if (!onRowSelect) return;
    const selected = Array.from(selectedIndices)
      .sort((a, b) => a - b)
      .map((i) => data[i])
      .filter((v) => v !== undefined);
    onRowSelect(selected);
  }, [selectedIndices, data, onRowSelect]);

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const isAllVisibleSelected = useMemo(() => {
    if (!selectable || rows.length === 0) return false;
    return rows.every((r) => selectedIndices.has(r.originalIndex));
  }, [rows, selectable, selectedIndices]);

  const isSomeVisibleSelected = useMemo(() => {
    if (!selectable || rows.length === 0) return false;
    const selectedCount = rows.reduce((acc, r) => acc + (selectedIndices.has(r.originalIndex) ? 1 : 0), 0);
    return selectedCount > 0 && selectedCount < rows.length;
  }, [rows, selectable, selectedIndices]);

  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeVisibleSelected && !isAllVisibleSelected;
    }
  }, [isSomeVisibleSelected, isAllVisibleSelected]);

  const handleToggleAll = () => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      const allSelected = rows.every((r) => next.has(r.originalIndex));
      if (allSelected) {
        rows.forEach((r) => next.delete(r.originalIndex));
      } else {
        rows.forEach((r) => next.add(r.originalIndex));
      }
      return next;
    });
  };

  const handleToggleRow = (originalIndex: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(originalIndex)) next.delete(originalIndex);
      else next.add(originalIndex);
      return next;
    });
  };

  return (
    <div className={`w-full overflow-x-auto rounded-md border border-gray-200 dark:border-neutral-700 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 text-sm">
        <thead className="bg-gray-50 dark:bg-neutral-800">
          <tr>
            {selectable && (
              <th className="w-10 px-3 py-2 text-left">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                  checked={isAllVisibleSelected}
                  onChange={handleToggleAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sortKey === col.dataIndex;
              const order = isSorted ? sortOrder : undefined;
              return (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap"
                >
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 ${
                      col.sortable ? '' : 'cursor-default'
                    }`}
                    onClick={col.sortable ? () => toggleSort(col.dataIndex as keyof T) : undefined}
                    aria-sort={isSorted ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <span>{col.title}</span>
                    {col.sortable && (
                      <svg
                        className={`h-3.5 w-3.5 text-gray-500 dark:text-gray-400 ${
                          isSorted ? 'opacity-100' : 'opacity-40'
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        {order === 'desc' ? (
                          <path d="M14.707 10.293a1 1 0 00-1.414 0L10 13.586 6.707 10.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" />
                        ) : (
                          <path d="M5.293 9.707a1 1 0 001.414 0L10 6.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z" />
                        )}
                      </svg>
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
          {loading ? (
            <tr>
              <td className="px-3 py-6 text-center text-gray-500 dark:text-gray-400" colSpan={(selectable ? 1 : 0) + columns.length}>
                <div className="inline-flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td className="px-3 py-6 text-center text-gray-500 dark:text-gray-400" colSpan={(selectable ? 1 : 0) + columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map(({ row, originalIndex }, i) => {
              const checked = selectable && selectedIndices.has(originalIndex);
              return (
                <tr key={originalIndex} className="hover:bg-gray-50/80 dark:hover:bg-neutral-800/60">
                  {selectable && (
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-blue-600"
                        checked={checked}
                        onChange={() => handleToggleRow(originalIndex)}
                        aria-label={`Select row ${i + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                      {String(row[col.dataIndex])}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;