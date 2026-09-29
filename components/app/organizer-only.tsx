import { ButtonLink } from '@/components/ui/button';

export function OrganizerOnly() {
  return (
    <div className="bg-surface ring-line grid place-items-center rounded-2xl px-6 py-16 text-center ring-1">
      <h1 className="text-2xl font-semibold tracking-tight">Hosting is for organizer accounts</h1>
      <p className="text-muted mt-2 max-w-[44ch] text-sm">
        Your account is set up for attending events. Ask the Valence team to switch it if you want to host.
      </p>
      <ButtonLink href="/dashboard" variant="secondary" className="mt-6">
        Back to overview
      </ButtonLink>
    </div>
  );
}
