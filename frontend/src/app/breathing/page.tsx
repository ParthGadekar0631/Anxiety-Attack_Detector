export default function BreathingPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Guided breathing</p>
          <h1 className="title">4-2-6 breathing</h1>
          <p className="subtitle">Inhale for 4 seconds, hold for 2 seconds, exhale for 6 seconds. Repeat until the risk state feels lower.</p>
        </header>
        <section className="breathingStage">
          <div className="breathingCircle" />
          <p className="sectionSub">Follow the circle. It expands on inhale and softens on exhale.</p>
        </section>
      </div>
    </main>
  );
}
