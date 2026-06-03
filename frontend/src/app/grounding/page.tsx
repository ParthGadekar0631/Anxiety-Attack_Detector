export default function GroundingPage() {
  const steps = ["5 things you can see", "4 things you can feel", "3 things you can hear", "2 things you can smell", "1 thing you can taste"];
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Grounding exercise</p>
          <h1 className="title">5-4-3-2-1 reset</h1>
          <p className="subtitle">A short structured exercise for interrupting escalation and returning attention to the present environment.</p>
        </header>
        <section className="card">
          <ul className="list">{steps.map((step) => <li key={step}><span className="dot" /> {step}</li>)}</ul>
        </section>
      </div>
    </main>
  );
}
