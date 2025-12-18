"use client";

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnxietyCheckinForm } from '@/components/forms/AnxietyCheckinForm';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { submitCheckin } from '@/services/patient';

interface CheckInViewProps {
  initialAccessToken?: string;
}

export function CheckInView({ initialAccessToken }: CheckInViewProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken ?? initialAccessToken;

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof submitCheckin>[1]) => submitCheckin(accessToken ?? '', payload),
    onSuccess: () => router.push('/dashboard'),
  });

  if (status === 'loading') {
    return <LoadingState label="Loading session" />;
  }

  if (!accessToken) {
    return <ErrorState message="You need to be signed in to submit a check-in." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily anxiety check-in</CardTitle>
        <CardDescription>Log how you are feeling today to keep your care team informed.</CardDescription>
      </CardHeader>
      <div className="px-6 pb-6">
        <AnxietyCheckinForm onSubmit={(payload) => mutation.mutateAsync(payload)} loading={mutation.isLoading} />
      </div>
    </Card>
  );
}
