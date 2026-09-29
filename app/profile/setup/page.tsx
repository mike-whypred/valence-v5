import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AppHeader } from '@/components/app/app-header';
import { Brand } from '@/components/brand';
import { ProfileForm } from '@/components/profile-form';
import { getViewer } from '@/lib/data';

export const metadata: Metadata = { title: 'Your profile' };

export default async function ProfileSetupPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/auth/login');
  const p = viewer.profile;
  const editing = !!p;

  return (
    <>
      {editing ? (
        <AppHeader viewer={viewer} />
      ) : (
        <header className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <Brand href="/" />
        </header>
      )}
      <main id="main" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-6 md:pt-14">
        <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">
          {editing ? 'Your profile' : `Nice to meet you, ${viewer.first_name || 'there'}.`}
        </h1>
        <p className="text-muted mt-3 max-w-[56ch]">
          {editing
            ? 'Changes update your summary and your matches at every event you have joined.'
            : 'Tell us what you do and who you want to meet. This is what matching reads, so specifics help.'}
        </p>
        <div className="mt-12">
          <ProfileForm
            editing={editing}
            person={{
              first_name: p?.first_name ?? viewer.first_name,
              last_name: p?.last_name ?? '',
              avatar_url: p?.avatar_url ?? null,
            }}
            initial={{
              job_title: p?.job_title ?? '',
              company: p?.company ?? '',
              industry: p?.industry ?? '',
              experience_years: p?.experience_years ?? 0,
              location: p?.location ?? '',
              bio: p?.bio ?? '',
              networking_goals: p?.networking_goals ?? '',
              skills: p?.skills ?? [],
            }}
          />
        </div>
      </main>
    </>
  );
}
