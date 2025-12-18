# Anxiety Attack Detection & Support Platform (AAD)

A production-ready, full-stack web platform for anxiety tracking that pairs a TypeScript Express API (clean architecture, MongoDB, role-based access) with a Next.js 14 App Router frontend featuring React Query, Tailwind CSS, and NextAuth authentication. The backend exposes RESTful services for patients, providers, and admins, plus a decoupled ML module for future model integration. The frontend delivers role-specific dashboards, daily check-ins, analytics, and emergency resources.

## Monorepo Layout

```
.
+-- backend/      # Node.js + Express + MongoDB API (TypeScript)
+-- frontend/     # Next.js 14 App Router client (TypeScript)
+-- .github/      # CI workflows
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB 6+ (local instance or Atlas cluster)
- Docker (optional, for container builds)

## Backend

### Environment

Copy `.env.example` to `.env` and update values:

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/aad
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
LOG_LEVEL=info
ALLOWED_ORIGINS=http://localhost:3000
MODEL_VERSION=v1
```

### Scripts

```bash
cd backend
npm install
npm run dev      # ts-node-dev watch server
npm run build    # compile to dist/
npm start        # run compiled server
```

### Highlights

- Clean architecture: controllers ? services ? repositories ? models
- Role-based access control via `authorize` middleware
- JWT access + refresh tokens stored hashed in MongoDB
- Zod validation on every request
- Centralized logging (Winston + Morgan) and error handling
- API versioning under `/api/v1`
- ML module (`src/ml`) exposes predictor interface with mock implementation & model output persistence

## Frontend

### Environment

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me
```

### Scripts

```bash
cd frontend
npm install
npm run dev      # Next.js dev server at http://localhost:3000
npm run build    # production build
npm start        # run production server
```

### Features

- Next.js 14 App Router with route groups for auth/protected flows
- NextAuth (credentials provider) with automatic token refresh
- React Query for patient/provider/admin dashboards
- Tailwind CSS utility design + custom UI primitives (button, card, alerts)
- Anxiety check-in form with Zod + React Hook Form validation
- Role-based dashboards (patient trends, provider roster, admin analytics)
- Emergency resource panel & reusable layout components

## Docker

Each app ships with a Dockerfile:

```bash
# Backend
cd backend
docker build -t aad-backend .

docker run -p 4000:4000 --env-file .env aad-backend

# Frontend
cd frontend
docker build -t aad-frontend .

docker run -p 3000:3000 --env-file .env.local aad-frontend
```

## Continuous Integration

`.github/workflows/ci.yml` installs dependencies for both apps and runs `npm run build` + `npm run lint` to ensure code quality on every push.

## Next Steps

1. Configure production secrets (JWT, NextAuth) and MongoDB connection.
2. Replace the mock ML predictor with your real model implementation under `backend/src/ml`.
3. Hook up email/SMS alerts for high-risk check-ins using the ML outputs stored in MongoDB.
4. Expand admin dashboards with deeper analytics or model management tooling.

Happy building!
