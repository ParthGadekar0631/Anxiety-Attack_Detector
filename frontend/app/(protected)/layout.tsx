import { ReactNode } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <div className="space-y-8">{children}</div>;
}
