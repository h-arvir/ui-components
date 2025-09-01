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
  const [activeView, setActiveView] = useState<'input' | 'table'>('input');
  const [password, setPassword] = useState('');

  type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string };
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const handleLogin = () => {
    const u = username.trim();
    const p = password.trim();

    if (!u && !p) {
      addToast('error', 'Please enter username and password.');
      return;
    }
    if (!u) {
      addToast('error', 'Username is required.');
      return;
    }
    if (!p) {
      addToast('error', 'Password is required.');
      return;
    }
    if (p.length < 8) {
      addToast('error', 'Password must be at least 8 characters.');
      return;
    }

    addToast('success', `Welcome, ${u}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-950 dark:to-neutral-900 text-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        {/* Toasts container */}
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-right">
          <div className="flex w-full max-w-md flex-col gap-2">
            {toasts.map((t) => (
              <div
                key={t.id}
                role="status"
                className={`pointer-events-auto group flex items-center gap-3 rounded-lg border p-3 shadow-md backdrop-blur transition
                  ${t.type === 'success' ? 'bg-emerald-50/80 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100' : ''}
                  ${t.type === 'error' ? 'bg-red-50/80 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100' : ''}
                  ${t.type === 'info' ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100' : ''}
                `}
              >
                <span className="shrink-0">
                  {t.type === 'success' && (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                  {t.type === 'error' && (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  )}
                  {t.type === 'info' && (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  )}
                </span>
                <p className="text-sm font-medium">{t.message}</p>
                <button onClick={() => removeToast(t.id)} className="ml-auto rounded p-1 text-current/70 hover:text-current" aria-label="Dismiss">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Uzence
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Two UI components</p>
        </header>

        <main className="space-y-4">
          {/* Toggle controls */}
          <div className="relative mx-auto w-full max-w-md">
            <div
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-fuchsia-500/20 blur-xl"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-2 rounded-xl bg-white/80 dark:bg-neutral-900/60 p-1 border border-gray-200 dark:border-neutral-800 shadow-sm backdrop-blur">
              <span
                className={`pointer-events-none absolute top-1 bottom-1 left-1 w-1/2 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 transition-transform duration-300 ease-out ${
                  activeView === 'table' ? 'translate-x-full' : 'translate-x-0'
                }`}
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => setActiveView('input')}
                aria-pressed={activeView === 'input'}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeView === 'input'
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {/* Input icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M3 17v4h4l11-11-4-4L3 17z" />
                  <path d="M14 6l4 4" />
                </svg>
                <span>Inputs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('table')}
                aria-pressed={activeView === 'table'}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeView === 'table'
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {/* Table icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 10h18M9 4v16M15 4v16" />
                </svg>
                <span>Table</span>
              </button>
            </div>
          </div>

          {activeView === 'input' ? (
            // Input card
            <section className="group mx-auto w-full sm:max-w-sm md:max-w-md lg:max-w-lg group rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 shadow-lg p-5 sm:p-6 backdrop-blur transition hover:border-blue-200/60 dark:hover:border-blue-900/40">
              {/* <div className="mb-4 flex items-center justify-end">
                <span className="opacity-0 group-hover:opacity-100 transition text-[10px] px-2 py-1 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-600/20">Interactive</span>
              </div> */}

              <div className="grid gap-4">
                <InputField
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  helperText="should not be empty"
                  variant="outlined"
                  size="md"
                  clearable
                />

                <InputField
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  passwordToggle
                  variant="filled"
                  size="sm"
                />

                <button
                  type="button"
                  onClick={handleLogin}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                    <path d="M15 3h4a2 2 0 012 2v4" />
                    <path d="M10 14L21 3" />
                    <path d="M21 10v11a2 2 0 01-2 2H8" />
                    <path d="M3 15h6v6" />
                  </svg>
                  Login
                </button>
              </div>
            </section>
          ) : (
            // Table card
            <section className="group rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 shadow-lg p-5 sm:p-6 backdrop-blur transition hover:border-blue-200/60 dark:hover:border-blue-900/40">
              <div className="mb-4 flex items-center justify-between text-center px-99">
                <div>
                  <h2 className="text-lg font-medium">Users</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sortable and selectable data table</p>
                </div>
                {/* <span className="opacity-0 group-hover:opacity-100 transition text-[10px] px-2 py-1 rounded-full bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 border border-indigo-600/20">Data</span> */}
              </div>

              <div className="rounded-lg border border-dashed border-gray-200 dark:border-neutral-800 p-2">
                <DataTable<User>
                  data={users}
                  columns={columns}
                  selectable
                  ariaLabel="Users table"
                  onRowSelect={(rows) => console.log('Selected rows:', rows)}
                />
              </div>
            </section>
          )}
        </main>

        <footer className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400">
          hire me :)
        </footer>
      </div>
    </div>
  );
}

export default App;
