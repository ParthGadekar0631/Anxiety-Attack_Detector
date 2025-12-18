import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/common/Navbar';

export const metadata: Metadata = {
  title: 'Anxiety Attack Detection & Support Platform',
  description: 'Personalized anxiety monitoring with patient, provider, and admin experiences.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
