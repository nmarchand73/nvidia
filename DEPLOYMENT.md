# GitHub Pages Deployment Guide

## URL Configuration

The application is configured to be deployed at: `https://nmarchand73.github.io/nvidia/`

## Current Configuration

- **Base Path**: `/nvidia/` (configured in `frontend/vite.config.ts`)
- **Router**: HashRouter (works with any base path)
- **Build Output**: `frontend/dist/`

## Troubleshooting

If the site doesn't work, check:

1. **GitHub Pages Settings**:
   - Go to Repository Settings > Pages
   - Source should be set to "GitHub Actions"
   - The workflow should be enabled

2. **Base Path Issues**:
   - Open browser console
   - Check for 404 errors on assets (JS/CSS files)
   - Verify that paths include `/nvidia/` prefix

3. **Data Loading**:
   - Check Network tab for `companies.json` requests
   - Should be requested from `/nvidia/companies.json`

4. **Common Issues**:
   - If assets return 404: base path might be incorrect
   - If app loads but shows "Chargement...": `companies.json` not found
   - If blank page: check browser console for JavaScript errors

## Testing Locally

```bash
cd frontend
npm run build
npm run preview
```

Visit: http://localhost:4173/nvidia/

