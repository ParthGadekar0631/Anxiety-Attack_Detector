export default function SettingsPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Settings</p>
          <h1 className="title">Module controls</h1>
          <p className="subtitle">The user model supports voice trigger, wearable monitoring, SMS alerts, and preferred calming style flags.</p>
        </header>
        <section className="card">
          <ul className="list">
            <li><span className="dot" /> Voice trigger enabled</li>
            <li><span className="dot" /> Wearable monitoring enabled</li>
            <li><span className="dot" /> SMS alerts enabled</li>
            <li><span className="dot" /> Preferred calming style: grounded</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
