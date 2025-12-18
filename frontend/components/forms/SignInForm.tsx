"use client";

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type Values = z.infer<typeof schema>;

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { register, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const result = await signIn('credentials', { ...values, redirect: false });
    if (result?.error) {
      setError('Unable to sign in with those credentials.');
      return;
    }
    onSuccess?.();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <Input type="email" autoComplete="email" {...register('email')} />
        {formState.errors.email && <p className="mt-1 text-sm text-danger">{formState.errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
        <Input type="password" autoComplete="current-password" {...register('password')} />
        {formState.errors.password && <p className="mt-1 text-sm text-danger">{formState.errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" isLoading={formState.isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
