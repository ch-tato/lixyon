'use client';
import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';

export function CustomCursor() {
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorOutline = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Center the custom cursors precisely on the mouse pointer
    gsap.set([cursorDot.current, cursorOutline.current], { xPercent: -50, yPercent: -50 });

    let activeTarget: HTMLElement | null = null;
    let isCurrentlyDisabled = false;

    const updateHoverState = (target: HTMLElement, isDisabled: boolean) => {
      if (isDisabled) {
        cursorDot.current?.classList.add('expand', 'disabled');
        
        gsap.to(cursorDot.current, { scale: 1, duration: 0.3, mixBlendMode: 'normal' });
        gsap.to(cursorOutline.current, { scale: 0, duration: 0.3 });
      } else {
        cursorDot.current?.classList.remove('expand', 'disabled');

        gsap.to(cursorDot.current, { scale: 0, duration: 0.3 });
        gsap.to(cursorOutline.current, {
          scale: 1.5, // Expanded size
          backgroundColor: '#C6FF00', // Solid volt color
          borderColor: 'transparent',
          mixBlendMode: 'difference',
          duration: 0.3,
        });
      }
    };

    const checkDisabledState = () => {
      if (!activeTarget) return;
      const isDisabled = (activeTarget as HTMLButtonElement).disabled === true || activeTarget.hasAttribute('disabled');
      if (isDisabled !== isCurrentlyDisabled) {
        isCurrentlyDisabled = isDisabled;
        updateHoverState(activeTarget, isDisabled);
      }
    };

    gsap.ticker.add(checkDisabledState);

    const handleMouseMove = (e: MouseEvent) => {
      // 3. GSAP Logic: Animate inner dot quickly (0.1s)
      gsap.to(cursorDot.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });

      // Animate outer outline with lag/momentum (0.5s)
      gsap.to(cursorOutline.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      // 4. Reactive Hover States: detect enter/leave on a, button, or .hover-target
      const target = (e.target as HTMLElement).closest('a, button, .hover-target, [data-cursor]') as HTMLElement;
      if (target) {
        activeTarget = target;
        const isDisabled = (target as HTMLButtonElement).disabled === true || target.hasAttribute('disabled');
        isCurrentlyDisabled = isDisabled;
        updateHoverState(target, isDisabled);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, .hover-target, [data-cursor]') as HTMLElement;
      if (target) {
        activeTarget = null;
        isCurrentlyDisabled = false;

        cursorDot.current?.classList.remove('expand', 'disabled');

        gsap.to(cursorDot.current, { scale: 1, duration: 0.3, mixBlendMode: 'difference' });
        gsap.to(cursorOutline.current, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: '#F4F4F0', // Paper color
          mixBlendMode: 'normal',
          duration: 0.3,
        });
      }
    };

    // 5. Lifecycle and Safety: clean up event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      gsap.ticker.remove(checkDisabledState);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  });

  // 2. HTML Structure: two distinct divs, hidden on mobile (hidden md:block), position fixed, top-0 left-0 pointer-events-none
  // Inline transitions set to 'none' to prevent conflicting with GSAP animations and old globals.css rules
  return (
    <>
      <div
        ref={cursorDot}
        className="cursor-dot hidden md:block fixed top-0 left-0 pointer-events-none w-2 h-2 rounded-full bg-paper z-[9999]"
        style={{ transition: 'none', mixBlendMode: 'difference' }}
      />
      <div
        ref={cursorOutline}
        className="cursor-outline hidden md:block fixed top-0 left-0 pointer-events-none w-10 h-10 rounded-full border border-paper z-[9998]"
        style={{ transition: 'none' }}
      />
    </>
  );
}
