import { useState } from 'react';
import InputField from './components/InputField';
import DataTable, { type Column } from './components/DataTable';

// Demo row type for the DataTable
type User = { id: number; name: string; email: string; role: 'Admin' | 'User' | 'Guest' };

const columns: Column<User>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role', sortable: true },
];

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Carol', email: 'carol@example.com', role: 'Guest' },
  { id: 4, name: 'Dave', email: 'dave@example.com', role: 'User' },
];

function App() {
  const [username, setUsername] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-950 dark:to-neutral-900 text-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Uzence UI Showcase
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Beautiful inputs and data tables with Tailwind styling</p>
        </header>

        <main className="grid gap-6 md:gap-8 md:grid-cols-2">
          {/* Input card */}
          <section className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/80 shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-medium mb-1">InputField</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Includes clear button and password toggle</p>

            <div className="grid gap-4">
              <InputField
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                helperText="Use 4–20 characters"
                variant="outlined"
                size="md"
                clearable
              />

              <InputField
                label="Password"
                type="password"
                placeholder="Enter password"
                passwordToggle
                variant="filled"
                size="sm"
              />
            </div>
          </section>

          {/* Table card */}
          <section className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/80 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-medium">Users</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sortable and selectable data table</p>
              </div>
            </div>

            <DataTable<User>
              data={users}
              columns={columns}
              selectable
              ariaLabel="Users table"
              onRowSelect={(rows) => console.log('Selected rows:', rows)}
            />
          </section>
        </main>

        <footer className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400">
          Built with Vite, React, and Tailwind CSS
        </footer>
      </div>
    </div>
  );
}

export default App;
