"use client";

import { useState } from "react";
import { apiFetch, ensureDemoUser, seedDemoContact } from "@/lib/apiClient";

type EmergencyNotifyResult = {
  provider: string;
  message: string;
};

export default function EmergencyPage() {
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<EmergencyNotifyResult | null>(null);

  async function notifyContacts() {
    setStatus("Preparing mock emergency contact alert...");
    try {
      await ensureDemoUser();
      await seedDemoContact();
      await apiFetch("/api/emergency/start", { method: "POST", body: JSON.stringify({ source: "manual" }) });
      const body = await apiFetch<EmergencyNotifyResult>("/api/emergency/notify", {
        method: "POST",
        body: JSON.stringify({ location: { latitude: 40.7128, longitude: -74.006 } }),
      });
      setResult(body);
      setStatus("Emergency contacts notified through mock SMS provider.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Emergency flow failed.");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge danger">Emergency flow</p>
          <h1 className="title">Calm-first escalation</h1>
          <p className="subtitle">This demo logs the emergency flow and sends mock SMS alerts unless Twilio credentials are configured.</p>
        </header>
        <section className="card">
          <ol className="flowList">
            <li>Start calming UI and guided breathing.</li>
            <li>Capture opt-in location for emergency display.</li>
            <li>Notify trusted contacts by mock/Twilio SMS.</li>
            <li>Show primary contact and emergency services call prompts.</li>
          </ol>
          <div className="row">
            <button className="primaryBtn" type="button" onClick={notifyContacts}>Notify trusted contact</button>
            <a className="secondaryBtn" href="tel:911">Emergency services prompt</a>
          </div>
          <p className="statusText">{status}</p>
          {result ? (
            <div className="resultCard">
              <p><strong>Provider:</strong> {result.provider}</p>
              <p><strong>Message:</strong> {result.message}</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
