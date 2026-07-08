'use client';
import { useRef, useCallback } from 'react';
import { Preloader } from '@/components/preloader/Preloader';
import { Hero, type HeroHandle } from '@/components/sections/Hero';
import { Marquee } from '@/components/ui/Marquee';
import { WhoAmI } from '@/components/sections/WhoAmI';
import { Arsenal } from '@/components/sections/Arsenal';
import { Fieldwork } from '@/components/sections/Fieldwork';
import { TerminalContact } from '@/components/sections/TerminalContact';
import { SiteFooter } from '@/components/sections/SiteFooter';

export default function HomePage() {
  const heroRef = useRef<HeroHandle>(null);

  const handlePreloaderExitStart = useCallback(() => {
    heroRef.current?.triggerScramble();
  }, []);

  return (
    <>
      {/* Preloader — sibling overlay, not a wrapper per §4.4 */}
      <Preloader onExitStart={handlePreloaderExitStart} />

      <main>
        {/* Hero */}
        <Hero ref={heroRef} />

        {/* Marquee 1 — §8.6: "PRACTICIONER" typo fixed to "PRACTITIONER" */}
        <div className="py-5 border-y border-paper/10 bg-ink relative z-10">
          <Marquee
            items={[
              'BACKEND DEVELOPER',
              'RED TEAM ENTHUSIAST',
              'DEVOPS PRACTITIONER',
              'SECOPS',
            ]}
            separator={<span className="px-6 text-volt">✦</span>}
            trackClassName="font-display text-5xl md:text-8xl uppercase"
          />
        </div>

        {/* WhoAmI */}
        <WhoAmI />

        {/* Arsenal (includes Marquee 2) */}
        <Arsenal />

        {/* Fieldwork */}
        <Fieldwork />

        {/* Terminal Contact */}
        <TerminalContact />

        {/* Footer */}
        <SiteFooter />
      </main>
    </>
  );
}
