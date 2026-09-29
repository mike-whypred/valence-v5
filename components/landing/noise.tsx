import { AsteriskIcon } from '@phosphor-icons/react/ssr';

// Lifted from the original landing page: what people say about networking today.
const complaints = [
  'Too many irrelevant connections',
  'Real conversations get lost in the crowd',
  'Generic requests waste everyone’s time',
  'Too much noise, not enough signal',
  'Hard to find the right people in your field',
  'It feels forced and transactional',
];

export function Noise() {
  const row = [...complaints, ...complaints];
  return (
    <section aria-label="Common complaints about networking" className="border-line overflow-hidden border-y py-7">
      <div className="animate-marquee flex w-max items-center">
        {row.map((c, i) => (
          <span
            key={i}
            className="text-muted flex items-center text-xl tracking-tight sm:text-2xl"
            aria-hidden={i >= complaints.length}
          >
            <span className="px-8">&ldquo;{c}&rdquo;</span>
            <AsteriskIcon weight="bold" className="text-ember size-4" />
          </span>
        ))}
      </div>
    </section>
  );
}
