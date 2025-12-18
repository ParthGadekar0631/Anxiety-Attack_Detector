"use client";

import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { PatientDashboard } from './PatientDashboard';
import { ProviderDashboard } from './ProviderDashboard';
import { AdminDashboard } from './AdminDashboard';
import { useSession } from 'next-auth/react';
import type { UserRole } from '@/types/api';

interface DashboardShellProps {
  initialRole: UserRole;
}

export function DashboardShell({ initialRole }: DashboardShellProps) {
  const { data: session, status } = useSession();
  const role = session?.user.role ?? initialRole;

  if (status === 'loading') {
    return <LoadingState label="Loading your dashboard" />;
  }

  if (!session) {
    return <ErrorState message="You need to sign in to view this page." />;
  }

  switch (role) {
    case 'patient':
      return <PatientDashboard />;
    case 'provider':
      return <ProviderDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <ErrorState message="Your account does not have access to this dashboard." />;
  }
}
