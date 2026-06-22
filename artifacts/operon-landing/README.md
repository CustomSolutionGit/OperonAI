# Operon AI Landing

Static landing page prepared for deployment to GitHub Pages from the repository `CustomSolutionGit/OperonAI`.

## Project path

This app lives in:

`artifacts/operon-landing`

## Local development

From the repository root:

```bash
npm --prefix artifacts/operon-landing install
npm --prefix artifacts/operon-landing run dev
```

Default local dev URL:

```text
http://localhost:5173/
```

Production preview:

```bash
npm --prefix artifacts/operon-landing run build
npm --prefix artifacts/operon-landing run preview
```

Default preview URL:

```text
http://localhost:4173/
```

## Deploy to GitHub Pages

A workflow is already included here:

`.github/workflows/deploy-pages.yml`

It builds the app from `artifacts/operon-landing` and deploys the generated `dist` folder to GitHub Pages.

### 1. Push the repository to GitHub

Repository:

`https://github.com/CustomSolutionGit/OperonAI`

The workflow is configured to deploy on push to `main`.

### 2. Enable GitHub Pages

In GitHub:

1. Open `CustomSolutionGit/OperonAI`
2. Go to `Settings`
3. Open `Pages`
4. In `Build and deployment`, select `GitHub Actions`

### 3. Verify the default branch

The workflow listens to:

```yaml
on:
  push:
    branches:
      - main
```

If your default branch is not `main`, update `.github/workflows/deploy-pages.yml`.

### 4. Trigger deployment

Push to `main`, or run the workflow manually from the `Actions` tab.

After a successful deployment, GitHub Pages will publish the site automatically.

## Google Analytics 4

GA4 is already wired into the app code.

File:

`src/lib/analytics.ts`

The app reads the measurement ID from the Vite environment variable:

```text
VITE_GA_MEASUREMENT_ID
```

Example value:

```text
G-XXXXXXXXXX
```

### 1. Create or find your GA4 Measurement ID

In Google Analytics:

1. Open your GA4 property
2. Go to `Admin`
3. Open `Data streams`
4. Select your web stream
5. Copy the `Measurement ID`

### 2. Add the ID to GitHub repository variables

In GitHub:

1. Open `CustomSolutionGit/OperonAI`
2. Go to `Settings`
3. Open `Secrets and variables` → `Actions`
4. Under `Variables`, create:

```text
Name: VITE_GA_MEASUREMENT_ID
Value: G-XXXXXXXXXX
```

The workflow already exposes this variable during build:

```yaml
env:
  VITE_GA_MEASUREMENT_ID: ${{ vars.VITE_GA_MEASUREMENT_ID }}
```

### 3. Re-deploy

Push a new commit or rerun the Pages workflow.

## Analytics events included

The landing currently tracks:

1. initial page view
2. `cta_click` for `Book a Demo`
3. `calendly_open` when the user clicks through to Calendly

CTA tracking is attached in:

`src/pages/Home.tsx`

## Favicon and app icons

The project includes:

1. `public/favicon.svg`
2. `public/favicon-16x16.png`
3. `public/favicon-32x32.png`
4. `public/apple-touch-icon.png`
5. `public/android-chrome-192x192.png`
6. `public/site.webmanifest`

These are already linked from `index.html`.

## Files that matter for deployment

Keep these in the repository:

1. `artifacts/operon-landing/index.html`
2. `artifacts/operon-landing/package.json`
3. `artifacts/operon-landing/package-lock.json`
4. `artifacts/operon-landing/src/`
5. `artifacts/operon-landing/public/`
6. `artifacts/operon-landing/vite.config.ts`
7. `artifacts/operon-landing/tsconfig.json`
8. `artifacts/operon-landing/.gitignore`
9. `artifacts/operon-landing/.env.example`
10. `.github/workflows/deploy-pages.yml`

Do not commit generated artifacts like:

1. `node_modules/`
2. `dist/`
3. local `.env` files

## Troubleshooting

### Pages workflow runs but site is empty

Check that GitHub Pages is set to `GitHub Actions`, not `Deploy from a branch`.

### Analytics does not appear in GA4

Check all of the following:

1. `VITE_GA_MEASUREMENT_ID` exists in GitHub repository variables
2. the variable value starts with `G-`
3. the workflow completed after the variable was added
4. the deployed site is loading the latest build

### `vite preview` fails locally

Build first:

```bash
npm --prefix artifacts/operon-landing run build
npm --prefix artifacts/operon-landing run preview
```
