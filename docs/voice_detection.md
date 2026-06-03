# Voice Detection

The voice module supports trigger phrases such as "I'm having a panic attack", "I need help", "Start anxiety help", and "Emergency anxiety support". The frontend demo sends a transcript to the backend; a browser Web Speech API integration can feed the same endpoint.

Voice stress extraction is simulated from acoustic metadata: speech rate, pitch variance, pause count, and volume variance. It is an estimate, not a clinical emotion detector.
