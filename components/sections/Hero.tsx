'use client';
import { useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ScrambleText, type ScrambleTextHandle } from '@/components/ui/ScrambleText';

export interface HeroHandle {
  triggerScramble: () => void;
}

export const Hero = forwardRef<HeroHandle>(function Hero(_props, ref) {
  const line1Ref = useRef<ScrambleTextHandle>(null);
  const line2Ref = useRef<ScrambleTextHandle>(null);
  const line3Ref = useRef<ScrambleTextHandle>(null);
  const line4Ref = useRef<ScrambleTextHandle>(null);

  const triggerScramble = useCallback(() => {
    const refs = [line1Ref, line2Ref, line3Ref, line4Ref];
    refs.forEach((r, index) => {
      setTimeout(() => {
        r.current?.play();
      }, index * 150);
    });
  }, []);

  useImperativeHandle(ref, () => ({ triggerScramble }), [triggerScramble]);

  return (
    <section
      id="top"
      className="relative h-[100svh] w-screen flex flex-col px-5 md:px-10 pt-24 pb-6 md:pb-8 overflow-hidden grid-bg"
    >
      {/* Top Row */}
      <div className="flex justify-between items-start flex-shrink-0">
        <div className="font-mono text-[10px] uppercase tracking-[.4em] text-paper/30 hidden md:block">
          BACKEND // DEVOPS // CYBERSECURITY
        </div>
        <div className="font-mono text-[10px] text-paper/45 max-w-[200px] text-right uppercase tracking-[.2em] ml-auto">
          <div>LAT 40.7128° N</div>
          <div>LNG 74.0060° W</div>
          <div className="mt-2 text-volt">— UPTIME 99.99%</div>
          <div className="mt-1">— THREAT LVL: GREEN</div>
        </div>
      </div>

      {/* Hero Title */}
      <div className="flex-grow flex flex-col justify-end pb-4">
        <h1 className="hero-title uppercase relative z-10" id="heroTitle">
          <span className="block">
            <ScrambleText ref={line1Ref} text="Building " className="italic text-volt" />
            <ScrambleText ref={line2Ref} text="What Lasts." />
          </span>
          <span className="block">
            <ScrambleText ref={line3Ref} text="Breaking " className="italic text-volt" />
            <ScrambleText ref={line4Ref} text="What Doesn't." />
          </span>
        </h1>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 flex-shrink-0">
        <div className="font-mono text-[11px] uppercase tracking-[.2em] max-w-sm text-paper/60 leading-relaxed">
          <span className="text-volt">→</span> Backend engineer, DevOps practitioner, and red team enthusiast focused
          on creating resilient systems by understanding how they fail.
        </div>
        <div className="flex items-center gap-4">
          <div className="scroll-indicator" />
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/45">
            Scroll to
            <br />
            decrypt<span className="text-volt"> ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
});
