'use client';
import { useRef, type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function useParallax(ref: RefObject<HTMLElement | null>) {
  const parentRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    parentRef.current = el.parentElement;

    gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: parentRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  }, { dependencies: [ref] });
}
