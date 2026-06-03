"use client";

import { FormEvent, useState } from "react";
import { apiFetch, ensureDemoUser, EpisodePayload } from "@/lib/apiClient";

type EpisodeResult = {
  prediction: {
    riskScore: number;
    confidenceScore: number;
    escalationProbability: number;
    riskCategory: string;
  };
  aiResponse: {
    message: string;
    breathingInstruction: string;
  };
};

const defaultPayload: EpisodePayload = {
  stressLevel: 8,
  heartRate: 118,
  sleepQuality: 3,
  breathingIrregularity: true,
  triggerEvent: true,
  triggerType: "crowded place",
  caffeineIntake: 2,
  mood: "anxious",
  chestTightness: 7,
  dizziness: 5,
  notes: "Felt escalation during commute.",
};

export default function EpisodePage() {
  const [form, setForm] = useState(defaultPayload);
  const [result, setResult] = useState<EpisodeResult | null>(null);
  const [status, setStatus] = useState("");

  function update<K extends keyof EpisodePayload>(key: K, value: EpisodePayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("Submitting episode to backend...");
    try {
      await ensureDemoUser();
      const body = await apiFetch<EpisodeResult>("/api/episodes", { method: "POST", body: JSON.stringify(form) });
      setResult(body);
      setStatus("Episode logged. Risk score and calming response generated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Episode submission failed.");
    }
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <p className="badge">Episode logging + prediction</p>
          <h1 className="title">Generate an anxiety risk score</h1>
          <p className="subtitle">The backend combines ML-service output with rule-based fallback scoring and returns a mock calming response.</p>
        </header>

        <form className="card formGrid" onSubmit={submit}>
          <label className="field">Stress level<input className="input" type="number" min="1" max="10" value={form.stressLevel} onChange={(e) => update("stressLevel", Number(e.target.value))} /></label>
          <label className="field">Heart rate<input className="input" type="number" value={form.heartRate} onChange={(e) => update("heartRate", Number(e.target.value))} /></label>
          <label className="field">Sleep quality<input className="input" type="number" min="1" max="10" value={form.sleepQuality} onChange={(e) => update("sleepQuality", Number(e.target.value))} /></label>
          <label className="field">Trigger type<input className="input" value={form.triggerType} onChange={(e) => update("triggerType", e.target.value)} /></label>
          <label className="field">Caffeine intake<input className="input" type="number" min="0" value={form.caffeineIntake} onChange={(e) => update("caffeineIntake", Number(e.target.value))} /></label>
          <label className="field">Mood<input className="input" value={form.mood} onChange={(e) => update("mood", e.target.value)} /></label>
          <label className="field">Chest tightness<input className="input" type="number" min="0" max="10" value={form.chestTightness} onChange={(e) => update("chestTightness", Number(e.target.value))} /></label>
          <label className="field">Dizziness<input className="input" type="number" min="0" max="10" value={form.dizziness} onChange={(e) => update("dizziness", Number(e.target.value))} /></label>
          <label className="checkField"><input type="checkbox" checked={form.breathingIrregularity} onChange={(e) => update("breathingIrregularity", e.target.checked)} /> Breathing irregularity</label>
          <label className="checkField"><input type="checkbox" checked={form.triggerEvent} onChange={(e) => update("triggerEvent", e.target.checked)} /> Trigger event occurred</label>
          <label className="field wide">Notes<textarea className="input" value={form.notes} onChange={(e) => update("notes", e.target.value)} /></label>
          <button className="primaryBtn wide" type="submit">Score and log episode</button>
        </form>

        <p className="statusText">{status}</p>
        {result ? (
          <section className="card resultCard">
            <h2 className="sectionTitle">Prediction result</h2>
            <div className="metricGrid">
              <div className="metricCard"><span className="metricLabel">Risk</span><strong className="metricValue">{result.prediction.riskScore}%</strong><span className="metricMeta">{result.prediction.riskCategory}</span></div>
              <div className="metricCard"><span className="metricLabel">Confidence</span><strong className="metricValue">{result.prediction.confidenceScore}</strong><span className="metricMeta">model confidence</span></div>
              <div className="metricCard"><span className="metricLabel">Escalation</span><strong className="metricValue">{result.prediction.escalationProbability}</strong><span className="metricMeta">probability</span></div>
            </div>
            <p className="sectionSub">{result.aiResponse.message}</p>
            <p className="sectionSub">{result.aiResponse.breathingInstruction}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
