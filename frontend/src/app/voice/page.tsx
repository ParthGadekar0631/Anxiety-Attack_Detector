"use client";

import { useState } from "react";
import { apiFetch, ensureDemoUser } from "@/lib/apiClient";

type VoiceResult = {
  triggerDetected: boolean;
  sample: {
    voiceStressScore: number;
    analysisSummary: string;
  };
};

export default function VoicePage() {
  const [transcript, setTranscript] = useState("I need help right now");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<VoiceResult | null>(null);

  async function analyze() {
    setStatus("Analyzing transcript and simulated acoustic features...");
    try {
      await ensureDemoUser();
      const body = await apiFetch<VoiceResult>("/api/voice/analyze", {
        method: "POST",
        body: JSON.stringify({
          transcript,
          features: { speechRate: 180, pitchVariance: 0.8, pauseCount: 8, volumeVariance: 0.75 },
        }),
      });
      setResult(body);
      setStatus(body.triggerDetected ? "Trigger phrase detected. Emergency flow can start." : "No trigger phrase detected.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Voice analysis failed.");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Voice trigger + stress extraction</p>
          <h1 className="title">Analyze a voice trigger phrase</h1>
          <p className="subtitle">Browser speech recognition can feed this module; this demo uses a typed transcript and simulated acoustic features.</p>
        </header>
        <section className="card">
          <label className="field">Transcript<textarea className="input tall" value={transcript} onChange={(e) => setTranscript(e.target.value)} /></label>
          <button className="primaryBtn" type="button" onClick={analyze}>Analyze voice sample</button>
          <p className="statusText">{status}</p>
          {result ? (
            <div className="resultCard">
              <p><strong>Trigger detected:</strong> {String(result.triggerDetected)}</p>
              <p><strong>Voice stress score:</strong> {result.sample.voiceStressScore}</p>
              <p>{result.sample.analysisSummary}</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
