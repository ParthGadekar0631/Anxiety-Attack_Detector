export default function PrivacyPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Privacy</p>
          <h1 className="title">Privacy and safety disclaimer</h1>
          <p className="subtitle">This project handles sensitive demo data and should be hardened before any production health use.</p>
        </header>
        <section className="card">
          <ul className="list">
            <li><span className="dot" /> Not a medical device or diagnostic tool.</li>
            <li><span className="dot" /> Use HTTPS, strong secrets, and least-privilege database access in production.</li>
            <li><span className="dot" /> HIPAA compliance is not claimed.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
