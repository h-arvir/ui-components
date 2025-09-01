# Uzence

A React + TypeScript + Vite project styled with Tailwind CSS. Includes a demo InputField and DataTable with simple toast notifications and login validation.

## Prerequisites
- Node.js 18+ (recommended 20+)
- npm 9+

Verify versions:
```bash
node -v
npm -v
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
   - Vite will print a local URL (usually http://localhost:5173). Open it in your browser.

## Build
- Create a production build:
  ```bash
  npm run build
  ```
- Preview the production build locally:
  ```bash
  npm run preview
  ```

## Testing
- Run tests in watch mode:
  ```bash
  npm run test
  ```
- Run tests once (CI):
  ```bash
  npm run test:run
  ```
- Optional UI mode:
  ```bash
  npm run test:ui
  ```

## Linting
- Run ESLint:
  ```bash
  npm run lint
  ```

## Project Structure (brief)
- `src/`
  - `App.tsx` — Demo page with Inputs and Table, toast notifications, and basic login validation
  - `components/`
    - `InputField.tsx` — Reusable input component (supports variants, sizes, password toggle, clearable, etc.)
    - `DataTable.tsx` — Simple sortable/selectable data table
- `index.html` — Vite entry HTML
- `vite.config.ts` — Vite configuration
- `tailwind.config.js` / `postcss.config.js` — Tailwind CSS setup

## Styling
- Tailwind CSS is configured and ready. Utility classes are used throughout components.

## Scripts (from package.json)
- `dev` — Start Vite dev server
- `build` — Type-check and build for production
- `preview` — Preview the production build
- `lint` — Run ESLint
- `test`, `test:ui`, `test:run` — Run tests with Vitest

## Notes
- If the default dev port is busy, Vite will pick another port and show it in the console.
- This repo uses TypeScript strict tooling and Tailwind for rapid UI development.
