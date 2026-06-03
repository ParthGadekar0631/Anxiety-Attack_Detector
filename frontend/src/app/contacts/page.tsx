import Link from "next/link";

export default function ContactsPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Emergency contacts</p>
          <h1 className="title">Trusted contact setup</h1>
          <p className="subtitle">The backend supports protected contact creation and mock/Twilio SMS notification.</p>
        </header>
        <section className="card">
          <p className="sectionSub">Use the emergency flow to seed a demo trusted contact and send a mock SMS alert.</p>
          <Link className="primaryBtn" href="/emergency">Open emergency flow</Link>
        </section>
      </div>
    </main>
  );
}
