import Link from "next/link";

export default function CalmPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Calming intervention</p>
          <h1 className="title">Start with the next breath</h1>
          <p className="subtitle">Use a structured breathing or grounding module, then escalate only if symptoms continue or feel unsafe.</p>
        </header>
        <section className="card">
          <div className="row">
            <Link className="primaryBtn" href="/breathing">Breathing guide</Link>
            <Link className="secondaryBtn" href="/grounding">Grounding guide</Link>
            <Link className="secondaryBtn" href="/emergency">Emergency flow</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
