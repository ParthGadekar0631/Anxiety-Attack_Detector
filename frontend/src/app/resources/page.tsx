import Link from "next/link";

export default function ResourcesPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Resources</p>
          <h1 className="title">Calming tools</h1>
          <p className="subtitle">Quick access to implemented breathing, grounding, episode scoring, and emergency flow modules.</p>
        </header>
        <section className="card">
          <div className="row">
            <Link className="primaryBtn" href="/breathing">Breathing</Link>
            <Link className="secondaryBtn" href="/grounding">Grounding</Link>
            <Link className="secondaryBtn" href="/episode">Episode scoring</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
