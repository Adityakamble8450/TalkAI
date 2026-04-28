# Perlexity deployment

## Local development

Backend env: copy `Backend/.env.example` to `Backend/.env`

Frontend env is optional. You only need `Frontend/.env` if you want to override the default local proxy behavior.

Run the apps separately during local development:

```bash
npm run dev --prefix Frontend
npm start --prefix Backend
```

The Vite dev server proxies `/api` and `/socket.io` to `http://localhost:5000`.

## Render deployment

This repo is configured to deploy as a single Render web service:

- Build command: `npm run install:all && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`

Required environment variables on Render:

- `NODE_ENV=production`
- `CLIENT_ORIGIN=https://<your-render-service>.onrender.com`
- `MONGO_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `MISTRAL_API_KEY`
- `TAVILY_API_KEY`
- `GOOGLE_USER`
- `CLIENT_ID`
- `CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

In production, Express serves the built frontend from `Frontend/dist`, so the app runs from one domain.
You do not need to set `VITE_API_URL` or `VITE_SOCKET_URL` on Render for the single-service deployment.
