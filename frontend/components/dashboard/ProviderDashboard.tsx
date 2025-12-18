"use client";

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskBadge } from '@/components/common/RiskBadge';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { fetchProviderPatients } from '@/services/provider';

export function ProviderDashboard() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;

  const { data: patients, isLoading, isError } = useQuery({
    queryKey: ['provider-patients'],
    queryFn: () => fetchProviderPatients(accessToken ?? ''),
    enabled: Boolean(accessToken),
  });

  if (status === 'loading') {
    return <LoadingState label="Loading session" />;
  }

  if (!accessToken) {
    return <ErrorState message="Unable to determine your session. Please sign in again." />;
  }

  if (isLoading) {
    return <LoadingState label="Loading patient roster" />;
  }

  if (isError || !patients) {
    return <ErrorState message="Unable to load provider dashboard data." />;
  }

  const highRisk = patients.filter((patient) => patient.riskLevel === 'high').length;
  const mediumRisk = patients.filter((patient) => patient.riskLevel === 'medium').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Patients" value={patients.length} description="Active assignments" accent="primary" />
        <StatCard label="High risk" value={highRisk} description="Needs urgent review" accent="danger" />
        <StatCard label="Moderate risk" value={mediumRisk} description="Monitor this week" accent="warning" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient roster</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Last check-in</th>
                <th className="pb-2">Risk level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <tr key={patient.id} className="text-slate-700">
                  <td className="py-3 font-medium text-slate-900">{patient.name}</td>
                  <td className="py-3 text-slate-500">{patient.email}</td>
                  <td className="py-3 text-slate-500">{patient.lastCheckin ? new Date(patient.lastCheckin).toLocaleDateString() : 'Not yet'}</td>
                  <td className="py-3">
                    <RiskBadge level={patient.riskLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
