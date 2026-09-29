import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth-shell';
import { LoginForm } from '@/components/login-form';
import { isDemo } from '@/lib/env';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <AuthShell image={195} caption="The best conversation of the night is usually with someone you almost didn't meet.">
      <h1 className="text-3xl font-semibold tracking-tighter">Welcome back</h1>
      <p className="text-muted mt-2">Sign in to see who is going to your next event.</p>
      {isDemo && (
        <p className="bg-ember-soft text-ink mt-6 rounded-xl px-4 py-3 text-sm">
          Running on sample data. Any email and password will sign you in as Tomás.
        </p>
      )}
      <div className="mt-8">
        <LoginForm demo={isDemo} />
      </div>
    </AuthShell>
  );
}
