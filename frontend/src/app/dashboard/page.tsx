"use client";

import Link from "next/link";
import { demoEpisodes, sparklinePoints, triggerBreakdown } from "@/lib/demoData";

export default function DashboardPage() {
  const riskPoints = sparklinePoints(demoEpisodes.map((entry) => entry.risk), 420, 120);
  const stressPoints = sparklinePoints(demoEpisodes.map((entry) => entry.stress * 10), 420, 120);
  const latest = demoEpisodes[demoEpisodes.length - 2];

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <p className="badge">Historical insights dashboard</p>
          <h1 className="title">Risk, triggers, and intervention trends</h1>
          <p className="subtitle">
            Demo charts use seeded local data until the backend has logged episodes. Submit an episode to populate live history.
          </p>
        </header>

        <section className="metricGrid">
          <article className="metricCard">
            <span className="metricLabel">Latest risk</span>
            <strong className="metricValue">{latest.risk}%</strong>
            <span className="metricMeta">Elevated</span>
          </article>
          <article className="metricCard">
            <span className="metricLabel">Confidence</span>
            <strong className="metricValue">0.82</strong>
            <span className="metricMeta">Mock/ML combined</span>
          </article>
          <article className="metricCard">
            <span className="metricLabel">Relapse risk</span>
            <strong className="metricValue">68%</strong>
            <span className="metricMeta">24-72 hour window</span>
          </article>
          <article className="metricCard">
            <span className="metricLabel">Emergency flows</span>
            <strong className="metricValue">3</strong>
            <span className="metricMeta">Mock SMS ready</span>
          </article>
        </section>

        <section className="twoCol">
          <article className="card">
            <div className="cardHeader">
              <h2 className="sectionTitle">Risk score over time</h2>
              <Link className="stripBtn" href="/episode">Log new</Link>
            </div>
            <svg viewBox="0 0 420 140" className="chart">
              <polyline points={riskPoints} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="chartLabels">{demoEpisodes.map((entry) => <span key={entry.label}>{entry.label}</span>)}</div>
          </article>

          <article className="card">
            <h2 className="sectionTitle">Stress trend</h2>
            <svg viewBox="0 0 420 140" className="chart alt">
              <polyline points={stressPoints} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="chartLabels">{demoEpisodes.map((entry) => <span key={entry.label}>{entry.stress}/10</span>)}</div>
          </article>
        </section>

        <section className="twoCol">
          <article className="card">
            <h2 className="sectionTitle">Trigger type distribution</h2>
            <div className="barList">
              {triggerBreakdown.map((trigger) => (
                <div className="barRow" key={trigger.name}>
                  <span>{trigger.name}</span>
                  <div className="barTrack"><span style={{ width: `${trigger.count * 18}%` }} /></div>
                  <strong>{trigger.count}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <h2 className="sectionTitle">Active modules</h2>
            <ul className="list">
              <li><span className="dot" /> Mock AI calming response provider</li>
              <li><span className="dot" /> Mock SMS fallback when Twilio is not configured</li>
              <li><span className="dot" /> Simulated wearable adapters for Apple, Fitbit, and Samsung</li>
              <li><span className="dot" /> Simulated voice stress feature extraction</li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
