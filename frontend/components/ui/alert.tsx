import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'danger';
  className?: string;
}

const variants: Record<NonNullable<AlertProps['variant']>, string> = {
  info: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-success/10 text-success border-success/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
};

export function Alert({ children, variant = 'info', className }: AlertProps) {
  return <div className={cn('rounded-md border px-3 py-2 text-sm', variants[variant], className)}>{children}</div>;
}
