# Deployment Guide

Deploy the frontend to Vercel with `frontend` as the project root and `NEXT_PUBLIC_API_URL` pointing at the deployed API. Deploy the Express backend to Render or Railway with `node backend/src/server.js` as the start command and MongoDB Atlas as `MONGO_URI`. Deploy the ML engine as a Python service with `uvicorn app.main:app --app-dir ml-engine --host 0.0.0.0 --port $PORT`.

For Docker/AWS, build the Compose services or individual images, run MongoDB as a managed service where possible, and configure secrets through the platform secret manager.
