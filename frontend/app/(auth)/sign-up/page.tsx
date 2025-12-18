import { SignUpForm } from '@/components/forms/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Create an account</h2>
        <p className="text-sm text-slate-600">Join the platform to start tracking anxiety trends.</p>
      </div>
      <SignUpForm />
    </div>
  );
}
