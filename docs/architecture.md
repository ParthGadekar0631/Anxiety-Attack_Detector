# Architecture

Anxiety Attack Detector is a monorepo with a Next.js frontend, Node.js/Express API, MongoDB persistence through Mongoose, and a Python FastAPI ML engine. The backend requires MongoDB; only the static GitHub Pages frontend demo uses a browser-side mock API layer.

The frontend collects episode inputs, simulated wearable readings, and voice transcripts. The backend validates authenticated requests, calls the ML engine when available, falls back to deterministic local scoring when unavailable, stores user-specific records, and coordinates intervention and emergency flows.
