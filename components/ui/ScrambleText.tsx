'use client';
import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import SplitType from 'split-type';
import { DURATION } from '@/lib/motion';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#________';

export interface ScrambleTextHandle {
  play: () => void;
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** If true, scramble plays automatically on mount */
  autoPlay?: boolean;
}

export const ScrambleText = forwardRef<ScrambleTextHandle, ScrambleTextProps>(
  function ScrambleText({ text, className = '', autoPlay = false }, ref) {
    const elRef = useRef<HTMLSpanElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const splitRef = useRef<SplitType | null>(null);

    // SplitType integration per §4.6: split into .char spans at mount
    useEffect(() => {
      const el = elRef.current;
      if (!el) return;

      // Set initial text
      el.textContent = text;

      // Use SplitType to create individual character spans
      splitRef.current = new SplitType(el, { types: 'chars' });

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
        }
      };
    }, [text]);

    const play = () => {
      const el = elRef.current;
      if (!el) return;

      if (intervalRef.current) clearInterval(intervalRef.current);

      // Revert SplitType before running scramble (we'll work on the element directly)
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }

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
          // Re-split after scramble completes
          if (elRef.current) {
            splitRef.current = new SplitType(elRef.current, { types: 'chars' });
          }
        }
        iteration += 1 / 2;
      }, DURATION.scrambleTick);
    };

    useImperativeHandle(ref, () => ({ play }), [text]);

    useEffect(() => {
      if (autoPlay) {
        // Small delay to ensure mount is complete
        const timer = setTimeout(play, 50);
        return () => clearTimeout(timer);
      }
    }, [autoPlay]);

    useEffect(() => {
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, []);

    return <span ref={elRef} className={className}>{text}</span>;
  }
);
