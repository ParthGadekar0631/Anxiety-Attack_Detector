"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type TriggerMode = "talk" | "breathing" | "grounding";

export default function TriggerPage() {
  const router = useRouter();
  const [mode, setMode] = useState<TriggerMode>("talk");
  const [isStarting, setIsStarting] = useState(false);

  const quickModes = useMemo(
    () =>
      [
        { key: "talk" as const, label: "Talk to AI", desc: "Start calming guidance" },
        { key: "breathing" as const, label: "Breathing", desc: "Guided breathing steps" },
        { key: "grounding" as const, label: "Grounding", desc: "5-4-3-2-1 technique" },
      ] as const,
    []
  );

  async function handleStart() {
    try {
      setIsStarting(true);

      // For now: navigate to /calm. Later we’ll:
      // 1) create a session in Zustand
      // 2) call API: POST /trigger/start
      router.push(`/calm?mode=${mode}`);
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <h1 className="title">Trigger</h1>
          <p className="subtitle">
            If you feel an anxiety attack coming on, start here. You can begin calming steps immediately.
          </p>
        </header>

        <section className="card">
          <h2 className="sectionTitle">How do you want to start?</h2>

          <div className="grid">
            {quickModes.map((m) => (
              <button
                key={m.key}
                className={`option ${mode === m.key ? "optionActive" : ""}`}
                onClick={() => setMode(m.key)}
                type="button"
              >
                <div className="optionTop">
                  <span className="optionLabel">{m.label}</span>
                  {mode === m.key ? <span className="pill">Selected</span> : null}
                </div>
                <span className="optionDesc">{m.desc}</span>
              </button>
            ))}
          </div>

          <div className="divider" />

          <div className="row">
            <button className="primaryBtn" onClick={handleStart} disabled={isStarting} type="button">
              {isStarting ? "Starting…" : "I need help"}
            </button>

            <button
              className="secondaryBtn"
              onClick={() => router.push("/emergency")}
              type="button"
              title="Go directly to emergency flow"
            >
              Emergency
            </button>
          </div>

          <p className="finePrint">
            Emergency is for escalation (contacts/call/911 prompt). The normal flow starts with calming steps.
          </p>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Permissions (we’ll wire this soon)</h2>
          <ul className="list">
            <li>
              <span className="dot" /> Location: used to show your location in emergency screens
            </li>
            <li>
              <span className="dot" /> Microphone: used for voice trigger / voice input (optional)
            </li>
            <li>
              <span className="dot" /> Notifications: used for reminders / status updates (optional)
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
