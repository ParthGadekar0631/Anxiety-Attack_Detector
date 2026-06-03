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
        { key: "talk" as const, label: "Talk to AI", desc: "Start mock calming guidance" },
        { key: "breathing" as const, label: "Breathing", desc: "Guided breathing steps" },
        { key: "grounding" as const, label: "Grounding", desc: "5-4-3-2-1 technique" },
      ] as const,
    []
  );

  function handleStart() {
    setIsStarting(true);
    router.push(mode === "breathing" ? "/breathing" : mode === "grounding" ? "/grounding" : "/calm");
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <p className="badge">Manual trigger</p>
          <h1 className="title">Start support flow</h1>
          <p className="subtitle">
            Start calming guidance immediately, then escalate to contacts or emergency services only if needed.
          </p>
        </header>

        <section className="card">
          <h2 className="sectionTitle">Choose a starting module</h2>
          <div className="grid">
            {quickModes.map((item) => (
              <button
                key={item.key}
                className={`option ${mode === item.key ? "optionActive" : ""}`}
                onClick={() => setMode(item.key)}
                type="button"
              >
                <div className="optionTop">
                  <span className="optionLabel">{item.label}</span>
                  {mode === item.key ? <span className="pill">Selected</span> : null}
                </div>
                <span className="optionDesc">{item.desc}</span>
              </button>
            ))}
          </div>

          <div className="divider" />

          <div className="row">
            <button className="primaryBtn" onClick={handleStart} disabled={isStarting} type="button">
              {isStarting ? "Starting..." : "I need help"}
            </button>
            <button className="secondaryBtn" onClick={() => router.push("/emergency")} type="button">
              Emergency flow
            </button>
          </div>
        </section>

        <section className="card">
          <h2 className="sectionTitle">Optional permissions</h2>
          <ul className="list">
            <li><span className="dot" /> Location can be attached to emergency notifications with consent.</li>
            <li><span className="dot" /> Microphone can support browser speech-to-text trigger capture.</li>
            <li><span className="dot" /> Notifications can support reminders and status updates.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
