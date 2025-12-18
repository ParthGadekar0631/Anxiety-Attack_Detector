import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Secure access</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Anxiety Attack Detection</h1>
        <p className="mt-2 text-sm text-slate-600">Log in to manage your anxiety tracking experience.</p>
      </div>
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">{children}</div>
    </div>
  );
}
