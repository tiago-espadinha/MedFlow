# MedFlow

React + TypeScript + Vite hospital operations demo, with a mock dataset persisted to localStorage.

    npm install
    npm run dev
    npm run lint     # check
    npm run format   # auto-fix (ESLint doubles as the formatter — no Prettier)

## Structure

    src/
    ├── app/            # App shell: provider composition + route table
    ├── components/
    │   ├── ui/         # Modal, Pill, NumberField, ListItem, ThemeToggle
    │   ├── charts/     # Bars, LineChart (plain SVG, no chart library)
    │   ├── dashboard/  # Kpis, AnimatedNumber
    │   └── layout/     # PageFade, Layout (sidebar shell)
    ├── features/
    │   ├── auth/       # roles, permissions, AuthProvider, Login
    │   ├── patients/   # per-admission patient chart + vitals form
    │   ├── resources/  # generic CRUD: table/form/detail-modal + per-resource config
    │   ├── overview/, reports/, settings/
    ├── data/           # seed.ts assembles the mock DB from data/mock/*.ts fragments
    ├── i18n/           # translation dictionary + provider
    ├── state/          # AppProvider — the mock "backend" (add/update/remove, localStorage)
    ├── types/          # database.ts (DB/Key/Row), resources.ts, patient.ts
    ├── utils/          # currency, dates, validation — small pure helpers shared across features
    └── styles/globals.css   # design tokens (light/dark) + primitives shared across features

## Styling

Styles are split by ownership: `styles/globals.css` holds the theme tokens and primitives used by many features
(buttons, panels, grid, tables, form controls). Anything owned by a single component sits next to it
(`Modal.css`, `Pill.css`, `Login.css`, …) and is imported by that component.

`components/layout/Layout.tsx` (the sidebar shell) isn't in the originally requested tree but
was added there since it's layout-level chrome, not tied to any one feature.

## What's in it

- Role-based sign-in (no real password) at /login: Administrator, Doctor, Nurse, Receptionist, Pharmacist, Billing staff. Each role sees a different set of pages in the sidebar (see features/auth/roles.ts).
- Doctors, Admissions, Laboratory, Billing, Pharmacy, Appointments: searchable/filterable tables, add, edit and delete, plus a detail view per row. Number fields use a custom stepper; date/time/month fields use native pickers.
- Admissions rows for roles with clinical access (admin, doctor, nurse) link to a per-patient chart at /admissions/:id, with vitals, a trend chart, goals and that patient's appointments.
- Overview and Reports are computed from the live mock data. Reports can be previewed, printed, or exported to CSV.
- Settings: language, dark mode, notification toggles, and (admin only) the hospital name.
- Localization: English, European Portuguese, Spanish, French — switchable on the login screen or in Settings.
- Animations via framer-motion: page fades, staggered KPI cards with count-up numbers, animated bar/line charts, list add/remove, and modal transitions. A discreet theme toggle is visible on every screen (sidebar on desktop, top bar on mobile, login), and switching themes eases colours across the whole UI. On mobile the sidebar becomes a slide-in drawer opened from a slim top bar with an account menu.

Data lives in src/data/ and is kept in the browser's localStorage (src/state/AppProvider.tsx), so edits survive a reload. "Restore sample data" in Settings resets it.
