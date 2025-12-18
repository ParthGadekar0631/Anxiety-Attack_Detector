"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { registerUser } from '@/services/auth';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type Values = z.infer<typeof schema>;

export function SignUpForm() {
  const { register, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setSuccess(null);
    try {
      await registerUser(values);
      setSuccess('Account created successfully. Signing you in…');
      await signIn('credentials', { ...values, redirect: false });
      router.push('/dashboard');
    } catch (err) {
      setError('Unable to create account. Please try again.');
      console.error(err);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <Input autoComplete="name" {...register('name')} />
        {formState.errors.name && <p className="mt-1 text-sm text-danger">{formState.errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <Input type="email" autoComplete="email" {...register('email')} />
        {formState.errors.email && <p className="mt-1 text-sm text-danger">{formState.errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
        <Input type="password" autoComplete="new-password" {...register('password')} />
        {formState.errors.password && <p className="mt-1 text-sm text-danger">{formState.errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" isLoading={formState.isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
