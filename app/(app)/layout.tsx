import { redirect } from 'next/navigation';
import { AppHeader } from '@/components/app/app-header';
import { getViewer } from '@/lib/data';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer) redirect('/auth/login');
  if (!viewer.profile) redirect('/profile/setup');
  return (
    <>
      <AppHeader viewer={viewer} />
      <main id="main" className="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-6 md:pt-14">
        {children}
      </main>
    </>
  );
}
