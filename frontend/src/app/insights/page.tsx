"use client";

import { useState } from "react";
import { apiFetch, ensureDemoUser } from "@/lib/apiClient";

type PersonalizedInsights = {
  personalizedRiskNotes: string;
  recommendedPreventiveActions: string[];
};

type RelapseRisk = {
  relapseRiskScore: number;
  relapseRiskCategory: string;
  window: string;
  explanation: string[];
};

export default function InsightsPage() {
  const [personalized, setPersonalized] = useState<PersonalizedInsights | null>(null);
  const [relapse, setRelapse] = useState<RelapseRisk | null>(null);
  const [status, setStatus] = useState("");

  async function loadInsights() {
    setStatus("Loading personalized and relapse-risk insights...");
    try {
      await ensureDemoUser();
      const personal = await apiFetch<{ insights: PersonalizedInsights }>("/api/insights/personalized");
      const relapseRisk = await apiFetch<{ relapseRisk: RelapseRisk }>("/api/insights/relapse-risk");
      setPersonalized(personal.insights);
      setRelapse(relapseRisk.relapseRisk);
      setStatus("Insights loaded from backend.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load insights.");
    }
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <p className="badge">Personalized adaptation + relapse model</p>
          <h1 className="title">History-aware risk insights</h1>
          <p className="subtitle">These deterministic insights use logged episodes, voice samples, and wearable anomaly history.</p>
        </header>
        <button className="primaryBtn" type="button" onClick={loadInsights}>Load backend insights</button>
        <p className="statusText">{status}</p>
        <section className="twoCol">
          <article className="card">
            <h2 className="sectionTitle">Personalized notes</h2>
            {personalized ? (
              <>
                <p className="sectionSub">{personalized.personalizedRiskNotes}</p>
                <ul className="list">{personalized.recommendedPreventiveActions.map((item: string) => <li key={item}><span className="dot" /> {item}</li>)}</ul>
              </>
            ) : <p className="sectionSub">Load insights to view recommendations.</p>}
          </article>
          <article className="card">
            <h2 className="sectionTitle">Relapse risk</h2>
            {relapse ? (
              <>
                <strong className="metricValue">{relapse.relapseRiskScore}%</strong>
                <p className="sectionSub">{relapse.relapseRiskCategory} risk in the {relapse.window} window.</p>
                <ul className="list">{relapse.explanation.map((item: string) => <li key={item}><span className="dot" /> {item}</li>)}</ul>
              </>
            ) : <p className="sectionSub">Load insights to view relapse-risk output.</p>}
          </article>
        </section>
      </div>
    </main>
  );
}
