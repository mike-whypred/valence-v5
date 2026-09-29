import { LandingNav } from '@/components/landing/nav';
import { Hero } from '@/components/landing/hero';
import { Noise } from '@/components/landing/noise';
import { How } from '@/components/landing/how';
import { Bento } from '@/components/landing/bento';
import { Organizers } from '@/components/landing/organizers';
import { Closing } from '@/components/landing/closing';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="grain">
      <LandingNav />
      <main id="main">
        <Hero />
        <Noise />
        <How />
        <Bento />
        <Organizers />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
