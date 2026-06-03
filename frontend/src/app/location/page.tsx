export default function LocationPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Opt-in location</p>
          <h1 className="title">Emergency location display</h1>
          <p className="subtitle">Location can be attached to episode and emergency notification payloads when the user grants permission.</p>
        </header>
        <section className="card">
          <p className="sectionSub">The demo emergency flow sends a sample map coordinate. Production should request browser geolocation permission at the point of need.</p>
        </section>
      </div>
    </main>
  );
}
