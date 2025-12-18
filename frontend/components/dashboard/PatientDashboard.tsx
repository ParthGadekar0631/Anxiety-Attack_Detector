"use client";

import { useQuery, useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/common/StatCard';
import { RiskBadge } from '@/components/common/RiskBadge';
import { AnxietyTrend } from '@/components/charts/AnxietyTrend';
import { AnxietyCheckinForm } from '@/components/forms/AnxietyCheckinForm';
import { EmergencyResources } from '@/components/common/EmergencyResources';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { fetchPatientSummary, submitCheckin } from '@/services/patient';

export function PatientDashboard() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [lastSubmission, setLastSubmission] = useState<Date | null>(null);

  const summaryQuery = useQuery({
    queryKey: ['patient-summary', lastSubmission?.toISOString()],
    queryFn: () => fetchPatientSummary(accessToken ?? ''),
    enabled: Boolean(accessToken),
  });

  const checkinMutation = useMutation({
    mutationFn: (payload: Parameters<typeof submitCheckin>[1]) => submitCheckin(accessToken ?? '', payload),
    onSuccess: () => setLastSubmission(new Date()),
  });

  if (!accessToken) {
    return <ErrorState message="Unable to load access token. Please sign in again." />;
  }

  if (summaryQuery.isLoading) {
    return <LoadingState label="Loading dashboard" />;
  }

  if (summaryQuery.isError) {
    return <ErrorState message="Unable to load your check-in summary." />;
  }

  const data = summaryQuery.data;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Current anxiety level"
          value={data?.currentAnxietyLevel ?? '—'}
          description={data?.riskLevel ? <RiskBadge level={data.riskLevel} /> : 'Log a check-in to get insights'}
          accent="primary"
        />
        <StatCard
          label="Last check-in"
          value={data?.lastCheckin ? new Date(data.lastCheckin).toLocaleDateString() : 'Not yet logged'}
          accent="secondary"
        />
        <StatCard label="Total check-ins" value={data?.totalCheckins ?? 0} accent="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily anxiety check-in</CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <AnxietyCheckinForm onSubmit={(payload) => checkinMutation.mutateAsync(payload)} loading={checkinMutation.isLoading} />
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trend overview</CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <AnxietyTrend data={data?.checkinData ?? []} />
          </div>
        </Card>
      </div>

      <EmergencyResources />
    </div>
  );
}
