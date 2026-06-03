# Emergency Flow

Emergency flow can start manually, from a detected voice trigger phrase, or from a high-risk prediction. The system starts calming guidance, captures opt-in location if available, logs an emergency action, sends mock or Twilio SMS alerts to trusted contacts, shows a primary contact call prompt, and includes an emergency services prompt.

Local development uses the mock SMS provider and records message payloads in the backend emergency action store.
