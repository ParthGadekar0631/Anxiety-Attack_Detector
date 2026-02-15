"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home">
      {/* Background decoration */}
      <div className="bgOrbs" aria-hidden="true">
        <span className="orb orb1" />
        <span className="orb orb2" />
        <span className="orb orb3" />
      </div>

      {/* Header */}
      <header className="siteHeader">
        <div className="siteHeaderInner">
          <Link href="/" className="brand">
            <span className="logoWrap">
              <Image
                src="/icons/logo.png"
                alt="Anxiety Attack Detector logo"
                width={34}
                height={34}
                priority
              />
            </span>
            <span className="brandText">Anxiety Attack Detector</span>
          </Link>

          <nav className="nav">
            <Link className="navLink" href="/">Home</Link>
            <Link className="navLink" href="/resources">Resources</Link>
            <Link className="navLink" href="/contacts">Contacts</Link>
            <Link className="navLink" href="/settings">Settings</Link>
          </nav>

          <div className="navActions">
            <button className="ghostBtn" type="button">Log in</button>
            <button className="primaryBtn" type="button">Sign up</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="heroInner">
          <div className="heroLeft">
            <p className="badge">Calm-first support • Escalation when needed</p>

            <h1 className="heroTitle">
              Feel it coming on?
              <br />
              Start calm steps in seconds.
            </h1>

            <p className="heroSub">
              A guided flow designed to help you regulate fast — with optional escalation to your
              emergency contacts and location sharing when you choose.
            </p>

            <div className="ctaRow">
              <Link className="ctaPrimary" href="/trigger">Start Help</Link>
              <Link className="ctaSecondary" href="/resources">View Resources</Link>
            </div>

            <div className="trustRow">
              <div className="trustItem">
                <span className="trustDot" /> Breathing + grounding guidance
              </div>
              <div className="trustItem">
                <span className="trustDot" /> Emergency contact escalation
              </div>
              <div className="trustItem">
                <span className="trustDot" /> Location share (opt-in)
              </div>
            </div>
          </div>

          <div className="heroRight">
            <div className="heroMediaCard">
              <div className="heroMediaHeader">
                <span className="pulseDot" />
                <span className="heroMediaLabel">Live calming demo</span>
              </div>

              <div className="heroMedia">
                <Image
                  src="/images/hero.png"
                  alt="Calming animation"
                  width={720}
                  height={480}
                  className="heroGif"
                  priority
                />
              </div>

              <div className="heroMediaFooter">
                <span className="miniPill">Breathing</span>
                <span className="miniPill">Grounding</span>
                <span className="miniPill">Talk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="sectionInner">
          <h2 className="sectionTitle">How it helps</h2>
          <p className="sectionSub">
            Simple, structured steps — designed for when your mind is loud.
          </p>

          <div className="featureGrid">
            <article className="featureCard">
              <h3>Trigger → Calm Flow</h3>
              <p>Start immediate guidance with breathing, grounding, and a calm-first approach.</p>
            </article>

            <article className="featureCard">
              <h3>Escalation Logic</h3>
              <p>Optionally notify trusted contacts, then escalate to calling if you choose.</p>
            </article>

            <article className="featureCard">
              <h3>Location + Medical Card</h3>
              <p>Show key info quickly in emergencies (opt-in and user-controlled).</p>
            </article>
          </div>
        </div>
      </section>

      {/* Resources strip */}
      <section className="resourcesStrip">
        <div className="sectionInner resourcesInner">
          <div>
            <h2 className="sectionTitle">Resources</h2>
            <p className="sectionSub">
              Quick grounding tools and links you can reach without thinking.
            </p>
          </div>

          <div className="resourceButtons">
            <Link className="stripBtn" href="/resources">Breathing exercises</Link>
            <Link className="stripBtn" href="/resources">Grounding guide</Link>
            <Link className="stripBtn" href="/resources">Crisis support</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="siteFooter">
        <div className="footerInner">
          <div className="footerCol">
            <div className="footerBrand">
              <span className="footerLogo">
                <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
              </span>
              <span>Anxiety Attack Detector</span>
            </div>
            <p className="footerText">
              A project-focused calm-first experience. Not a substitute for professional care.
            </p>
          </div>

          <div className="footerCol">
            <p className="footerHeading">Navigate</p>
            <Link className="footerLink" href="/">Home</Link>
            <Link className="footerLink" href="/trigger">Start Help</Link>
            <Link className="footerLink" href="/resources">Resources</Link>
          </div>

          <div className="footerCol">
            <p className="footerHeading">Legal</p>
            <Link className="footerLink" href="/privacy">Privacy</Link>
            <Link className="footerLink" href="/terms">Terms</Link>
          </div>
        </div>

        <div className="footerBottom">
          <span>© {new Date().getFullYear()} Anxiety Attack Detector</span>
        </div>
      </footer>
    </main>
  );
}
