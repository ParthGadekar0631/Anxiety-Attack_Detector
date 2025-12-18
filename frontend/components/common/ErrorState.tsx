interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = 'Something went wrong. Please try again.' }: ErrorStateProps) {
  return (
    <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
      {message}
    </div>
  );
}
