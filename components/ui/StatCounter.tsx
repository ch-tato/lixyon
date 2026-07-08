'use client';
import { useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface StatCounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  accent?: boolean;
}

export function StatCounter({ value, suffix = '', decimals = 0, label, accent = false }: StatCounterProps) {
  const counterRef = useRef<HTMLDivElement>(null);

  useCountUp(counterRef, value, {
    decimals,
    suffix,
    padDigits: decimals > 0 ? undefined : (value >= 100 ? 3 : 2),
  });

  // Initial display value
  const initialDisplay = decimals > 0
    ? `${(0).toFixed(decimals)}${suffix}`
    : `${'0'.padStart(value >= 100 ? 3 : 2, '0')}${suffix}`;

  return (
    <div>
      <div
        ref={counterRef}
        className={`font-display text-5xl md:text-7xl ${accent ? 'text-volt' : ''}`}
      >
        {initialDisplay}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[.25em] text-paper/50 mt-2">
        {label}
      </div>
    </div>
  );
}
