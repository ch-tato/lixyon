'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const glitchRef = useRef<HTMLHeadingElement>(null);
  const decoyRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = glitchRef.current;
    if (!el) return;

    const chars = '!<>-_\\/[]{}';
    const original = '404';

    const ctx = gsap.context(() => {
      const doGlitch = () => {
        // Create the scrambled text
        const glitched = original
          .split('')
          .map((c) =>
            Math.random() > 0.5
              ? chars[Math.floor(Math.random() * chars.length)]
              : c
          )
          .join('');
        el.innerText = glitched;

        // Briefly hold the glitch, then snap back
        gsap.delayedCall(0.08, () => {
          el.innerText = original;
        });

        // Trigger next glitch at a random interval between 0.2s and 2s
        gsap.delayedCall(Math.random() * 1.8 + 0.2, doGlitch);
      };

      // Start the loop
      doGlitch();
    });

    return () => ctx.revert();
  }, []);

  const handleDecoyClick = () => {
    const btn = decoyRef.current;
    if (!btn) return;

    // Ensure the button stays within viewport bounds and avoids the top navbar
    const paddingX = 20;
    const paddingTop = 100; // Keep away from the top edge/navbar
    const paddingBottom = 20;
    
    const maxX = window.innerWidth - btn.offsetWidth - paddingX;
    const maxY = window.innerHeight - btn.offsetHeight - paddingBottom;

    // Generate random coordinates
    const randomX = Math.max(paddingX, Math.random() * maxX);
    const randomY = Math.max(paddingTop, Math.random() * maxY);

    // Force teleport immediately
    gsap.set(btn, {
      position: 'fixed',
      left: randomX,
      top: randomY,
      margin: 0,
      zIndex: 9999, // Ensure it's above absolutely everything
    });

    // Add a rapid glitchy blink effect upon reappearing
    const tl = gsap.timeline();
    tl.set(btn, { opacity: 0, scale: 0.9 })
      .to(btn, { opacity: 1, scale: 1.05, duration: 0.05 })
      .to(btn, { opacity: 0, scale: 0.95, duration: 0.05 })
      .to(btn, { opacity: 1, scale: 1, duration: 0.05 })
      .to(btn, { opacity: 0.3, duration: 0.05 })
      .to(btn, { opacity: 1, duration: 0.05 });
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden pt-24 pb-12">
      {/* 1. The Hero Section (Glitch 404) */}
      <div className="text-center z-10 flex flex-col items-center">
        <h1
          ref={glitchRef}
          className="font-display text-[8rem] md:text-[15rem] leading-none text-volt mix-blend-screen select-none"
        >
          404
        </h1>
        <div className="font-mono text-sm md:text-base text-paper/70 mt-4 space-y-1 text-left w-fit">
          <p>{'>'} TARGET: UNKNOWN</p>
          <p>{'>'} STATUS: ERR_CONNECTION_REFUSED</p>
          <p>{'>'} THREAT LVL: ELEVATED</p>
        </div>
      </div>

      {/* 2. The Terminal Interface */}
      <div className="mt-12 w-full max-w-2xl border border-paper/20 bg-ink2/80 backdrop-blur-md p-6 rounded-sm z-10 shadow-[0_0_15px_rgba(198,255,0,0.05)]">
        <div className="font-mono text-xs sm:text-sm text-paper/80 space-y-2">
          <p>
            <span className="text-volt">$</span> nmap -p 404 root@server
          </p>
          <p>PORT &nbsp;&nbsp;STATE &nbsp;SERVICE</p>
          <p>
            404/tcp <span className="text-red-500">closed</span> unknown
          </p>
          <p className="text-paper/50 pt-2">
            {'>'} Access denied. Route does not exist in the current mesh.
          </p>
        </div>
      </div>

      {/* 3. The Interactive Decoy */}
      <div className="mt-12 z-20">
        <button
          ref={decoyRef}
          onClick={handleDecoyClick}
          className="font-mono text-xs md:text-sm text-volt border border-volt px-6 py-3 hover:bg-volt hover:text-ink transition-colors uppercase tracking-widest outline-none"
          data-cursor
          data-label="DENIED"
        >
          [ FORCE CONNECTION ]
        </button>
      </div>

      {/* 4. The Real Escape Hatch */}
      <div className="mt-16 z-10">
        <Button variant="framed" href="/" cursorLabel="ESCAPE">
          $ cd /root/home
        </Button>
      </div>
    </main>
  );
}
