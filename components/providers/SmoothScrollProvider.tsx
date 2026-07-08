'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { EASE } from '@/lib/motion';

const LenisContext = createContext<Lenis | null>(null);
export const useLenisInstance = () => useContext(LenisContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.globalTimeline.timeScale(0.001);
      return; // native scroll, no Lenis instance
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: EASE.lenis,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    gsap.ticker.add((time) => instance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    instance.on('scroll', () => ScrollTrigger.update());

    setLenis(instance);
    return () => {
      instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
