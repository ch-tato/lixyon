'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { EASE, DURATION } from '@/lib/motion';

interface BlockRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function BlockReveal({ children, className = '' }: BlockRevealProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !content || !overlay) return;

    gsap.set(content, { opacity: 0 });
    gsap.set(overlay, {
      scaleX: 0,
      transformOrigin: 'left',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 95%',
        once: true,
      },
    });

    tl.to(overlay, {
      scaleX: 1,
      duration: DURATION.wipeIn,
      ease: EASE.wipeIn,
    })
      .set(content, { opacity: 1 })
      .set(overlay, { transformOrigin: 'right' })
      .to(overlay, {
        scaleX: 0,
        duration: DURATION.wipeOut,
        ease: EASE.wipeOut,
      });
  }, { scope: wrapperRef });

  return (
    <span ref={wrapperRef} className={`block-reveal ${className}`}>
      <span ref={contentRef}>{children}</span>
      <span ref={overlayRef} className="block-overlay bg-volt" />
    </span>
  );
}
