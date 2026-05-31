# Vercel frontend deployment

Deploy the Vite frontend as a Vercel project from this repository.

## Project settings

- Root Directory: `frontend`
- Framework Preset: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Config file: `frontend/vercel.json`

The committed `frontend/vercel.json` rewrites all routes to `index.html` so React Router deep links can load directly on Vercel.

## Required environment variables

Set this variable on the Vercel frontend project:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Public Railway backend URL, for example `https://your-api.up.railway.app`. |

Vite reads `VITE_API_BASE_URL` at build time, so redeploy the frontend after changing the backend URL.

## Smoke check

After deployment:

1. Open the Vercel URL.
2. Visit a direct nested route such as `/login` to confirm SPA deep links return the app instead of a 404.
3. Try login or another API-backed screen and confirm requests target the Railway backend URL.
