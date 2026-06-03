"use client";

import { useState } from "react";
import { apiFetch, ensureDemoUser } from "@/lib/apiClient";

type WearableResult = {
  reading: {
    source: string;
    heartRate: number;
  };
  analysis: {
    wearableRiskScore: number;
    anomalyDetected: boolean;
  };
};

export default function WearablesPage() {
  const [source, setSource] = useState("apple");
  const [result, setResult] = useState<WearableResult | null>(null);
  const [status, setStatus] = useState("");

  async function simulate() {
    setStatus("Simulating wearable adapter reading...");
    try {
      await ensureDemoUser();
      const body = await apiFetch<WearableResult>("/api/wearables/simulate", { method: "POST", body: JSON.stringify({ source }) });
      setResult(body);
      setStatus("Wearable reading ingested and analyzed.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Wearable simulation failed.");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Simulated Apple/Fitbit/Samsung adapters</p>
          <h1 className="title">Wearable biometric ingestion</h1>
          <p className="subtitle">Real APIs require developer accounts and consent. This module uses adapter-compatible simulated readings.</p>
        </header>
        <section className="card">
          <div className="segmented">
            {["apple", "fitbit", "samsung"].map((item) => (
              <button key={item} className={source === item ? "segment active" : "segment"} type="button" onClick={() => setSource(item)}>
                {item}
              </button>
            ))}
          </div>
          <button className="primaryBtn" type="button" onClick={simulate}>Simulate reading</button>
          <p className="statusText">{status}</p>
          {result ? (
            <div className="metricGrid">
              <div className="metricCard"><span className="metricLabel">Source</span><strong className="metricValue small">{result.reading.source}</strong></div>
              <div className="metricCard"><span className="metricLabel">Heart rate</span><strong className="metricValue">{result.reading.heartRate}</strong></div>
              <div className="metricCard"><span className="metricLabel">Risk</span><strong className="metricValue">{result.analysis.wearableRiskScore}%</strong></div>
              <div className="metricCard"><span className="metricLabel">Anomaly</span><strong className="metricValue small">{String(result.analysis.anomalyDetected)}</strong></div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
