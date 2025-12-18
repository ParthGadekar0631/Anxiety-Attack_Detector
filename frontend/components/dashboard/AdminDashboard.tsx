"use client";

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/common/StatCard';
import { RiskBadge } from '@/components/common/RiskBadge';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { fetchAdminAnalytics, fetchUsers } from '@/services/admin';

export function AdminDashboard() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;

  const analyticsQuery = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => fetchAdminAnalytics(accessToken ?? ''),
    enabled: Boolean(accessToken),
  });

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => fetchUsers(accessToken ?? ''),
    enabled: Boolean(accessToken),
  });

  if (status === 'loading') {
    return <LoadingState label="Loading session" />;
  }

  if (!accessToken) {
    return <ErrorState message="Unable to determine your session. Please sign in again." />;
  }

  if (analyticsQuery.isLoading || usersQuery.isLoading) {
    return <LoadingState label="Loading analytics" />;
  }

  if (analyticsQuery.isError || usersQuery.isError || !analyticsQuery.data || !usersQuery.data) {
    return <ErrorState message="Unable to load admin dashboard data." />;
  }

  const analytics = analyticsQuery.data;
  const users = usersQuery.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total users" value={analytics.totalUsers} accent="primary" />
        <StatCard label="Active patients" value={analytics.activePatients} accent="success" />
        <StatCard label="Providers" value={analytics.providerCount} accent="secondary" />
        <StatCard label="Total check-ins" value={analytics.totalCheckins} accent="warning" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent high-risk alerts</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          {analytics.recentHighRisk.length ? (
            <ul className="space-y-3">
              {analytics.recentHighRisk.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between rounded-md border border-danger/20 bg-danger/5 px-4 py-2 text-sm text-danger">
                  <span>
                    {entry.user?.name ?? 'Unknown user'} - {new Date(entry.createdAt).toLocaleString()}
                  </span>
                  <RiskBadge level="high" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No high risk check-ins in the last 7 days.</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User directory</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="text-slate-700">
                  <td className="py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="py-3 text-slate-500">{user.email}</td>
                  <td className="py-3 capitalize">{user.role}</td>
                  <td className="py-3">{user.isActive ? 'Active' : 'Suspended'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
