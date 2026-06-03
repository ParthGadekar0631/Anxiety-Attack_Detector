# Database Architecture

The API uses MongoDB through Mongoose as the only persistence layer.

## Core collections

- `users`
  Stores identity, auth provider metadata, security preferences, medical notes, and support-module settings.
- `auth_events`
  Immutable audit log for registration, login, Google auth, 2FA challenge creation, 2FA verification, and security-setting updates.
- `twofactorchallenges`
  Short-lived challenge records for optional 2FA. Codes are stored as hashes and expire automatically with a TTL index.
- `emergencycontacts`
  Trusted contacts used for escalation and SMS delivery.
- `episodes`
  Primary anxiety event records including symptoms, triggers, location context, intervention state, and risk outputs.
- `predictions`
  Risk model outputs and input snapshots, optionally linked to an episode.
- `wearablereadings`
  Simulated or ingested wearable biometrics and anomaly analysis.
- `voicesamples`
  Transcript-trigger checks and simulated voice-stress feature results.
- `emergencyactions`
  Durable log of emergency flow actions such as flow start and SMS delivery attempts.
- `medications`
  Medication regimen records including dosage, schedule, prescriber, refill metadata, and active state.
- `medicationlogs`
  Dose adherence records linked to medications.

## Relationships

- A `user` owns many `episodes`, `predictions`, `wearablereadings`, `voicesamples`, `emergencycontacts`, `emergencyactions`, `medications`, `medicationlogs`, `auth_events`, and `twofactorchallenges`.
- A `prediction` may reference one `episode`.
- An `emergencyaction` may reference one `episode` and one `emergencycontact`.
- A `medicationlog` references one `medication`.

## Operational notes

- The API requires `MONGO_URI`; there is no in-memory fallback.
- Authentication uses JWTs backed by persisted `users`.
- 2FA challenges are persisted in MongoDB, not process memory.
- Tests use `mongodb-memory-server` so CI still exercises Mongoose and MongoDB semantics.
