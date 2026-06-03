"use client";

import Image from "next/image";
import Link from "next/link";
import { demoEpisodes, sparklinePoints } from "@/lib/demoData";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const assetPath = (path: string) => `${basePath}${path}`;

export default function HomePage() {
  const points = sparklinePoints(demoEpisodes.map((episode) => episode.risk), 340, 110);

  return (
    <main className="home">
      <header className="siteHeader">
        <div className="siteHeaderInner">
          <Link href="/" className="brand">
            <span className="logoWrap">
              <Image src={assetPath("/icons/logo.png")} alt="Anxiety Attack Detector logo" width={34} height={34} priority />
            </span>
            <span className="brandText">Anxiety Attack Detector</span>
          </Link>

          <nav className="nav">
            <Link className="navLink" href="/">Home</Link>
            <Link className="navLink" href="/dashboard">Dashboard</Link>
            <Link className="navLink" href="/episode">Episode</Link>
            <Link className="navLink" href="/voice">Voice</Link>
            <Link className="navLink" href="/wearables">Wearables</Link>
          </nav>

          <div className="navActions">
            <Link className="ghostBtn" href="/login">Log in</Link>
            <Link className="primaryBtn" href="/signup">Sign up</Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="heroInner">
          <div className="heroLeft">
            <p className="badge">AI support + simulated biometric adapters</p>
            <h1 className="heroTitle">Anxiety Attack Detector</h1>
            <p className="heroSub">
              A full-stack support platform that combines episode logging, voice trigger detection,
              wearable-style signals, ML risk scoring, calming guidance, relapse-risk insights, and
              mock emergency contact alerts.
            </p>

            <div className="ctaRow">
              <Link className="ctaPrimary" href="/episode">Log Episode</Link>
              <Link className="ctaSecondary" href="/emergency">Emergency Flow</Link>
            </div>

            <div className="trustRow">
              <div className="trustItem"><span className="trustDot" /> Mock AI calming provider</div>
              <div className="trustItem"><span className="trustDot" /> Apple/Fitbit/Samsung simulation</div>
              <div className="trustItem"><span className="trustDot" /> Voice stress + relapse model</div>
            </div>
          </div>

          <div className="heroRight">
            <div className="heroMediaCard">
              <div className="heroMediaHeader">
                <span className="pulseDot" />
                <span className="heroMediaLabel">Risk trend demo</span>
              </div>

              <div className="heroMedia dashboardPreview">
                <Image src={assetPath("/images/hero.png")} alt="Calming visual" width={720} height={480} className="heroGif" priority />
                <svg viewBox="0 0 340 120" className="previewChart" aria-label="Risk trend preview">
                  <polyline points={points} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="heroMediaFooter">
                <span className="miniPill">Risk scoring</span>
                <span className="miniPill">Relapse risk</span>
                <span className="miniPill">Mock alerts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="sectionInner">
          <h2 className="sectionTitle">Implemented modules</h2>
          <p className="sectionSub">
            The original roadmap features are now active with mock or simulated adapters where real credentials are unavailable.
          </p>

          <div className="featureGrid">
            <article className="featureCard">
              <h3>Risk + intervention engine</h3>
              <p>Combines rule scoring and ML-style prediction, then returns calming guidance and emergency escalation recommendations.</p>
            </article>
            <article className="featureCard">
              <h3>Voice + wearable simulation</h3>
              <p>Detects configured trigger phrases and analyzes simulated acoustic, Apple Watch, Fitbit, and Samsung Health readings.</p>
            </article>
            <article className="featureCard">
              <h3>Insights + relapse risk</h3>
              <p>Uses logged history to summarize recurring triggers, risk trends, wearable anomalies, and 24-72 hour repeat-risk estimates.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="resourcesStrip">
        <div className="sectionInner resourcesInner">
          <div>
            <h2 className="sectionTitle">Safety note</h2>
            <p className="sectionSub">
              This app does not diagnose or treat any condition. For immediate danger, contact local emergency services.
            </p>
          </div>
          <div className="resourceButtons">
            <Link className="stripBtn" href="/breathing">Breathing</Link>
            <Link className="stripBtn" href="/grounding">Grounding</Link>
            <Link className="stripBtn" href="/insights">Insights</Link>
          </div>
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerInner">
          <div className="footerCol">
            <div className="footerBrand">
              <span className="footerLogo"><Image src={assetPath("/icons/logo.png")} alt="Logo" width={24} height={24} /></span>
              <span>Anxiety Attack Detector</span>
            </div>
            <p className="footerText">
              Portfolio project with mock AI, mock SMS, simulated wearable adapters, and simulated voice stress extraction.
            </p>
          </div>
          <div className="footerCol">
            <p className="footerHeading">App</p>
            <Link className="footerLink" href="/dashboard">Dashboard</Link>
            <Link className="footerLink" href="/episode">Episode</Link>
            <Link className="footerLink" href="/emergency">Emergency</Link>
          </div>
          <div className="footerCol">
            <p className="footerHeading">Legal</p>
            <Link className="footerLink" href="/privacy">Privacy</Link>
            <Link className="footerLink" href="/terms">Terms</Link>
          </div>
        </div>
        <div className="footerBottom"><span>Not a medical device or diagnostic tool.</span></div>
      </footer>
    </main>
  );
}
