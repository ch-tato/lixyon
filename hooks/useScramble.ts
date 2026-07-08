'use client';
import { useEffect, useRef, useCallback } from 'react';
import { DURATION } from '@/lib/motion';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#________';

export function useScramble(
  ref: React.RefObject<HTMLElement | null>,
  text: string,
  options?: { autoPlay?: boolean }
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasPlayed = useRef(false);

  const play = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;

    intervalRef.current = setInterval(() => {
      el.textContent = text
        .split('')
        .map((char, index) => {
          if (index < iteration) return text[index];
          if (char === ' ') return ' ';
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iteration += 1 / 2; // half-speed resolution per source
    }, DURATION.scrambleTick);

    hasPlayed.current = true;
  }, [ref, text]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Auto-play on mount if requested
  useEffect(() => {
    if (options?.autoPlay && !hasPlayed.current) {
      play();
    }
  }, [options?.autoPlay, play]);

  return { play };
}
