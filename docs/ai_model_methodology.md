# AI Model Methodology

Risk scoring combines deterministic ML-style probability with rule-based contributors. The rule layer adds points for high stress, elevated heart rate, poor sleep, breathing irregularity, trigger events, chest tightness, dizziness, recent episode count, wearable anomalies, and high voice stress.

The FastAPI service exposes prediction, relapse-risk, voice-stress, wearable-risk, and training endpoints. The current implementation uses synthetic/deterministic logic so it is explainable and runnable in a portfolio environment without external datasets.
