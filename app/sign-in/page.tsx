'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { signInLocal, signUpLocal } from '@/lib/localAuth';

const signInSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInValues = z.infer<typeof signInSchema>;

const APPLE_EMAIL_DOMAIN = '@apple.com';

function isAppleEmail(email: string) {
  return email.toLowerCase().endsWith(APPLE_EMAIL_DOMAIN);
}

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleSignIn(values: SignInValues) {
    if (!isAppleEmail(values.email)) {
      toast({
        title: 'Access restricted',
        description: 'Only users with an @apple.com email can access this dashboard.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await signInLocal(values.email, values.password);

      if (!result.ok) {
        toast({
          title: 'Sign-in failed',
          description: result.error ?? 'Invalid email or password.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Signed in',
        description: 'You have been signed in successfully.',
      });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Unexpected error',
        description: 'Something went wrong while signing in.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(values: SignInValues) {
    if (!isAppleEmail(values.email)) {
      toast({
        title: 'Access restricted',
        description: 'Only users with an @apple.com email can sign up for this dashboard.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await signUpLocal(values.email, values.password);

      if (!result.ok) {
        toast({
          title: 'Sign-up failed',
          description: result.error ?? 'Could not create account.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Account created',
        description: 'You have been signed in.',
      });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Unexpected error',
        description: 'Something went wrong while signing up.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-zinc-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-950/70 backdrop-blur-xl p-8 shadow-2xl">
        <div className="mb-8 text-center space-y-2">
          <div className="mx-auto h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500" />
          <h1 className="text-2xl font-semibold text-white">
            Sign in to RepIntel
          </h1>
          <p className="text-sm text-zinc-400">
            Access your company reputation dashboard.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignIn)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={form.handleSubmit(handleSignUp)}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

