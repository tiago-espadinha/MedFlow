# Architecture

MedFlow is a single-page React application with no server component. `src/main.tsx` mounts `src/app/App.tsx`, which wraps the routes in the application's context providers. Feature pages read and change shared state through those providers, and the state is saved to `localStorage`.

## Stack and runtime

- Language and framework: TypeScript in strict mode, React 18.
- Runtime and version: modern browsers; Node.js 20.19+ or 22.12+ to build.
- Package manager: npm.
- Entry points: `index.html`, `src/main.tsx`.

## Boundaries

The application is frontend only, and it has no API or external data service.

| Directory         | Responsibility                                         |
| ----------------- | ------------------------------------------------------ |
| `src/app/`        | Application shell, providers and routes                |
| `src/components/` | Reusable charts, dashboard, layout and UI components   |
| `src/data/`       | Seed data                                              |
| `src/features/`   | Auth, overview, patients, reports, resources, settings |
| `src/i18n/`       | Language list, translation dictionary and provider     |
| `src/state/`      | Shared application state                               |
| `src/types/`      | Domain and database types                              |
| `src/utils/`      | Validation, date and currency helpers                  |
| `src/styles/`     | Global styles and design tokens                        |

## Data and state

- Stores: `localStorage` keys `vv-db` (records), `vv-set` (settings), `vv-session` (signed-in role and name) and `vv-lang` (language).
- Key entities: doctors, admissions, laboratory orders, invoices, medications and appointments, plus vitals and goals on patient charts.
- Ownership and authorization rules: data belongs to the browser it was created in and isn't shared between users or devices.
- Migrations and seed strategy: the first load starts from `src/data/seed.ts`, and the Settings page can restore that sample data. There are no migrations.

## Routing and permissions

`src/app/routes.tsx` defines the routes. Signed-out visitors are sent to `/login`, and a route the current role can't view redirects to `/`. The generic `/:key` route renders the resource page for any key in the resource configuration, while `/admissions/:id` opens a patient chart.

`src/features/auth/roles.ts` lists the pages each role can see. The navigation and the route guards both read from that list through `canView`.

## Localization

`src/i18n/translations.ts` maps English strings to Portuguese, Spanish and French. `t()` looks up a string at display time and falls back to English when there is no translation. Stored values such as statuses stay in English, so filtering behaves the same in every language.

## Trust boundaries

Everything runs in the visitor's browser, so all data and role checks can be changed by that visitor. Sign-in records the chosen role without credentials, and permissions shape the interface rather than protect data. Values read from `localStorage` are parsed without schema validation; if parsing fails, the application falls back to its defaults.

## Configuration

- Environment variable names: none.
- Local development: `npm install`, then `npm run dev`.
- Staging and production: see [Deployment](DEPLOYMENT.md).

## Testing

- Unit, integration and end-to-end: none are automated.
- CI: none.
- What isn't automated: application behaviour is checked in the browser. ESLint, `tsc` and the production build are run by hand.
