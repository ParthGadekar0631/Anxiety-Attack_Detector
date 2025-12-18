import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-slate-100 text-slate-700',
};

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', styles[variant], className)}>{children}</span>;
}
