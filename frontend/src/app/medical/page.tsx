export default function MedicalPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Medical notes</p>
          <h1 className="title">Sensitive emergency details</h1>
          <p className="subtitle">Medical notes are included in mock SMS templates only when the user has provided them.</p>
        </header>
        <section className="card">
          <p className="sectionSub">Production deployments should encrypt sensitive notes, enforce strict access controls, and support deletion/export workflows.</p>
        </section>
      </div>
    </main>
  );
}
