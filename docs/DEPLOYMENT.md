# Deployment

MedFlow builds to static files and is hosted on Vercel at <https://med-flow-amber.vercel.app>.

## Configuration

- Environment variables: none.
- Build command: `npm run build`.
- Output directory: `dist`.
- Routing: `vercel.json` rewrites every path to `/index.html`, so direct links to client-side routes load the application.

## First deploy

1. Import the repository into Vercel.
2. Confirm the build command and output directory above.
3. Choose the production branch in the project settings.
4. Deploy, then open a nested route such as `/admissions` directly to confirm the rewrite works.

## Before a release

```bash
npm run lint
npx tsc --noEmit
npm run build
npm audit --audit-level=high
```

## After a release

Sign in, open the overview and a patient chart, switch language and theme, and check that the mobile navigation drawer works.

## Other hosts

Any static host works if it serves `dist` and falls back to `index.html` for unknown paths.
