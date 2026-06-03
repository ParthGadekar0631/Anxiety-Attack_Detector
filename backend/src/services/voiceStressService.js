const triggerPhrases = [
  "i'm having a panic attack",
  "im having a panic attack",
  "i need help",
  "start anxiety help",
  "emergency anxiety support",
];

function detectTrigger(transcript = "") {
  const normalized = transcript.toLowerCase().trim();
  return triggerPhrases.some((phrase) => normalized.includes(phrase));
}

function scoreVoiceStress(features = {}) {
  const speechRate = Number(features.speechRate ?? features.speech_rate ?? 155);
  const pitchVariance = Number(features.pitchVariance ?? features.pitch_variance ?? 0.45);
  const pauseCount = Number(features.pauseCount ?? features.pause_count ?? 4);
  const volumeVariance = Number(features.volumeVariance ?? features.volume_variance ?? 0.4);

  const score = Math.min(
    100,
    Math.max(0, (speechRate - 120) * 0.35 + pitchVariance * 24 + pauseCount * 4 + volumeVariance * 28)
  );

  return {
    voiceStressScore: Math.round(score),
    acousticFeatures: { speechRate, pitchVariance, pauseCount, volumeVariance },
    analysisSummary:
      score >= 70
        ? "Simulated acoustic features indicate elevated stress."
        : "Simulated acoustic features indicate low-to-moderate stress.",
  };
}

module.exports = { detectTrigger, scoreVoiceStress, triggerPhrases };
