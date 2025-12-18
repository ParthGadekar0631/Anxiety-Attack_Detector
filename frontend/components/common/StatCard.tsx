import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  accent?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const accents: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

export function StatCard({ label, value, description, accent = 'primary' }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
        <p className={`text-3xl font-semibold ${accents[accent]}`}>{value}</p>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    </Card>
  );
}
