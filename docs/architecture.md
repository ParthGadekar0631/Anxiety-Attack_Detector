# Architecture

Anxiety Attack Detector is a monorepo with a Next.js frontend, Node.js/Express API, MongoDB-ready persistence, and a Python FastAPI ML engine. The backend can run without MongoDB by using an in-memory store, which keeps the local demo runnable without paid services.

The frontend collects episode inputs, simulated wearable readings, and voice transcripts. The backend validates authenticated requests, calls the ML engine when available, falls back to deterministic local scoring when unavailable, stores user-specific records, and coordinates intervention and emergency flows.
