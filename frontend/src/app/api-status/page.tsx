import { API_URL } from "@/lib/apiClient";

export default function ApiStatusPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Service status</p>
          <h1 className="title">API status</h1>
          <p className="subtitle">Backend health endpoint: {API_URL}/api/health</p>
        </header>
        <section className="card">
          <p className="sectionSub">Run make server or docker-compose up --build before checking live API responses.</p>
        </section>
      </div>
    </main>
  );
}
