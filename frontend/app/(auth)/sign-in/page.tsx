import { SignInForm } from '@/components/forms/SignInForm';

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
        <p className="text-sm text-slate-600">Enter your credentials to continue.</p>
      </div>
      <SignInForm />
    </div>
  );
}
