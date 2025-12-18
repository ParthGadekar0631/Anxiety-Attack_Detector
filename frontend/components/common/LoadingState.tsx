interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Loading data...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
