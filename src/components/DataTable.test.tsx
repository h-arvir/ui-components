import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DataTable, { type Column } from './DataTable';

interface Row { id: number; name: string; age: number }

const columns: Column<Row>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
];

const data: Row[] = [
  { id: 2, name: 'Bob', age: 25 },
  { id: 1, name: 'Alice', age: 30 },
];

describe('DataTable', () => {
  it('renders rows and columns', () => {
    render(<DataTable<Row> data={data} columns={columns} ariaLabel="Users" />);
    expect(screen.getByRole('table', { name: /users/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /id/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /bob/i })).toBeInTheDocument();
  });

  it('sorts by column when header is clicked', () => {
    render(<DataTable<Row> data={data} columns={columns} />);
    // Click on Name header to sort asc
    const nameHeader = screen.getByRole('button', { name: /name, sort ascending/i });
    fireEvent.click(nameHeader);
    // After sorting asc, first row should be Alice
    const cells = screen.getAllByRole('cell');
    expect(cells[1]).toHaveTextContent('Alice');
    // Click again to sort desc; first row should be Bob
    fireEvent.click(nameHeader);
    const cellsDesc = screen.getAllByRole('cell');
    expect(cellsDesc[1]).toHaveTextContent('Bob');
  });

  it('supports selecting rows', () => {
    const onRowSelect = vi.fn();
    render(<DataTable<Row> data={data} columns={columns} selectable onRowSelect={onRowSelect} />);
    const checkbox = screen.getByRole('checkbox', { name: /select row 1/i });
    fireEvent.click(checkbox);
    expect(onRowSelect).toHaveBeenCalled();
    const rows = onRowSelect.mock.calls.at(-1)?.[0] as Row[];
    expect(rows?.[0]?.name).toBe('Bob');
  });

  it('shows loading state', () => {
    render(<DataTable<Row> data={[]} columns={columns} loading />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('shows empty state', () => {
    render(<DataTable<Row> data={[]} columns={columns} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});