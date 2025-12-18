import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CheckInView } from '@/components/dashboard/CheckInView';

export default async function CheckInPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/sign-in');
  }

  return <CheckInView initialAccessToken={session.accessToken ?? ''} />;
}
