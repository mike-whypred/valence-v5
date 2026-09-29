import { Brand } from '@/components/brand';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col px-4 py-6 sm:px-10">
      <Brand />
      <main id="main" className="grid flex-1 place-items-center">
        <div className="max-w-md text-center">
          <p className="text-ember font-mono text-sm">404</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter">This page is not on the guest list.</h1>
          <p className="text-muted mt-3">The link may be old, or the event may have ended.</p>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/">Go home</ButtonLink>
            <ButtonLink href="/events/join" variant="secondary">
              Enter a code
            </ButtonLink>
          </div>
        </div>
      </main>
    </div>
  );
}
