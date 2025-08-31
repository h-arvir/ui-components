import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import DataTable, { type Column } from './DataTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Guest';
}

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable as any,
};

export default meta;

type Story = StoryObj<typeof DataTable<User>>;

const columns: Column<User>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role', sortable: true },
];

const sampleData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Carol', email: 'carol@example.com', role: 'Guest' },
  { id: 4, name: 'Dave', email: 'dave@example.com', role: 'User' },
];

export const Default: Story = {
  render: () => {
    return (
      <div className="p-6 bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
        <DataTable<User> data={sampleData} columns={columns} />
      </div>
    );
  },
};

export const SortableSelectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<User[]>([]);
    return (
      <div className="p-6 space-y-4 bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
        <DataTable<User>
          data={sampleData}
          columns={columns}
          selectable
          onRowSelect={setSelected}
        />
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Selected: {selected.length > 0 ? selected.map((u) => u.name).join(', ') : '—'}
        </div>
      </div>
    );
  },
};

export const LoadingEmpty: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<User[]>([]);

    React.useEffect(() => {
      const t = setTimeout(() => {
        setLoading(false);
        setData([]);
      }, 1200);
      return () => clearTimeout(t);
    }, []);

    return (
      <div className="p-6 bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
        <DataTable<User> data={data} columns={columns} loading={loading} />
      </div>
    );
  },
};