'use client';
import { useRef, type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { EASE, DURATION } from '@/lib/motion';

interface CountUpOptions {
  decimals?: number;
  suffix?: string;
  padDigits?: number;
}

export function useCountUp(
  ref: RefObject<HTMLElement | null>,
  target: number,
  options: CountUpOptions = {}
) {
  const { decimals = 0, suffix = '', padDigits } = options;
  const objRef = useRef({ v: 0 });

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    objRef.current.v = 0;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(objRef.current, {
          v: target,
          duration: DURATION.countUp,
          ease: EASE.count,
          onUpdate: () => {
            const val = objRef.current.v;
            if (decimals > 0) {
              el.textContent = val.toFixed(decimals) + suffix;
            } else {
              const pad = padDigits ?? (target >= 100 ? 3 : 2);
              el.textContent =
                Math.floor(val).toString().padStart(pad, '0') + suffix;
            }
          },
        });
      },
    });
  }, { dependencies: [ref, target, decimals, suffix, padDigits] });
}
