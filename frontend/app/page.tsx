import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    { title: 'Guided check-ins', description: 'Capture symptoms, triggers, and coping mechanisms with structured forms powered by Zod validation.' },
    { title: 'Provider collaboration', description: 'Clinicians receive real-time risk alerts, dashboards, and patient context to intervene quickly.' },
    { title: 'Admin oversight', description: 'Operational analytics, API health, and role management ensure compliance and readiness for ML expansion.' },
  ];

  return (
    <section className="space-y-10">
      <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-1 shadow-soft">
        <div className="rounded-3xl bg-white/90 p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Anxiety Attack Detection</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Modern mental health monitoring for patients, providers, and admins
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Track anxiety levels, analyze triggers, and surface critical insights instantly. Built with Next.js 14, React Query,
            Tailwind, and a secure Node.js API prepared for future ML integrations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-up">Create an account</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
