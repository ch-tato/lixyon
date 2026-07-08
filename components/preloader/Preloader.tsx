'use client';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { DURATION } from '@/lib/motion';
import { useLenisInstance } from '@/components/providers/SmoothScrollProvider';

interface PreloaderProps {
  onExitStart?: () => void;
}

const bootStages = [
  { threshold: 0, text: 'ESTABLISHING SECURE CONNECTION' },
  { threshold: 25, text: 'DECRYPTING PORTFOLIO ARCHIVE' },
  { threshold: 50, text: 'LOADING VISUAL ASSETS' },
  { threshold: 75, text: 'CALIBRATING RENDER PIPELINE' },
  { threshold: 92, text: 'READY FOR UPLINK' },
];

export function Preloader({ onExitStart }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const lenis = useLenisInstance();

  useGSAP(() => {
    const preloader = preloaderRef.current;
    const counter = counterRef.current;
    const progress = progressRef.current;
    const stage = stageRef.current;

    if (!preloader || !counter || !progress || !stage) return;

    // Lock scroll
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';

    const value = { v: 0 };
    const tl = gsap.timeline();

    tl.to(value, {
      v: 100,
      duration: DURATION.preloaderCount,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.floor(value.v);
        counter.textContent = v.toString().padStart(2, '0');
        progress.style.width = v + '%';
        const currentStage = [...bootStages].reverse().find((s) => v >= s.threshold);
        if (currentStage) stage.textContent = currentStage.text;
      },
    }).to(preloader, {
      y: '-100%',
      duration: DURATION.preloaderExit,
      ease: 'power4.inOut',
      delay: DURATION.preloaderExitDelay,
      onStart: () => {
        if (lenis) lenis.start();
        document.body.style.overflow = '';
        onExitStart?.();
      },
      onComplete: () => {
        setHidden(true);
        ScrollTrigger.refresh();
      },
    });
  }, { dependencies: [lenis] });

  if (hidden) return null;

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="absolute top-6 left-6 md:top-10 md:left-10 font-mono text-[10px] tracking-[.3em] uppercase text-paper/40">
        LIXYON/33 — BOOT SEQUENCE
      </div>
      <div className="absolute top-6 right-6 md:top-10 md:right-10 font-mono text-[10px] tracking-[.3em] uppercase text-paper/40">
        <span className="blink text-volt">●</span> SECURE CHANNEL
      </div>

      <div className="pre-counter" ref={counterRef}>
        00
      </div>

      <div
        className="absolute bottom-6 left-6 md:bottom-10 md:left-10 font-mono text-[10px] tracking-[.3em] uppercase text-paper/50"
        ref={stageRef}
      >
        ESTABLISHING SECURE CONNECTION
      </div>
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 font-mono text-[10px] tracking-[.3em] uppercase text-paper/40">
        v.2.5.1 // BUILD 0x4F2A
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-paper/10">
        <div className="h-full bg-volt w-0" ref={progressRef} />
      </div>
    </div>
  );
}
