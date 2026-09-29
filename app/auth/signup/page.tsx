import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth-shell';
import { SignupForm } from '@/components/signup-form';

export const metadata: Metadata = { title: 'Create account' };

export default async function SignupPage({ searchParams }: PageProps<'/auth/signup'>) {
  const { role } = await searchParams;
  return (
    <AuthShell image={42} caption="Set up once. Every event you join after this starts with a short list.">
      <h1 className="text-3xl font-semibold tracking-tighter">Create your account</h1>
      <p className="text-muted mt-2">Takes a minute. Your profile comes next.</p>
      <div className="mt-8">
        <SignupForm initialRole={role === 'organizer' ? 'organizer' : 'member'} />
      </div>
    </AuthShell>
  );
}
