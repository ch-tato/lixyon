'use client';

import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';

/* ─────────────────────────────────────────────
   Reusable Button — 'framed' | 'unframed'
   
   Framed: border + sweep-fill on hover via GSAP
   Unframed: clean text-only link style
   ──────────────────────────────────────────── */

type ButtonVariant = 'framed' | 'unframed';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Render as an <a> tag instead of <button> */
  href?: string;
  /** Custom cursor label (integrates with CustomCursor) */
  cursorLabel?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'framed',
  href,
  cursorLabel,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  if (variant === 'unframed') {
    return (
      <UnframedButton
        href={href}
        cursorLabel={cursorLabel}
        className={className}
        {...rest}
      >
        {children}
      </UnframedButton>
    );
  }

  return (
    <FramedButton
      href={href}
      cursorLabel={cursorLabel}
      className={className}
      {...rest}
    >
      {children}
    </FramedButton>
  );
}

/* ═══════════════════════════════════════════════
   UNFRAMED VARIANT
   Clean text-only link/button, no border/bg.
   ═══════════════════════════════════════════════ */

function UnframedButton({
  href,
  cursorLabel,
  children,
  className = '',
  ...rest
}: Omit<ButtonProps, 'variant'>) {
  const baseClasses = [
    'relative inline-flex items-center gap-2',
    'font-mono text-xs uppercase tracking-[.25em]',
    'text-paper/70 hover:text-volt',
    'transition-colors duration-300',
    'group',
  ].join(' ');

  const content = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-0 bg-volt transition-all duration-500 ease-out group-hover:w-full" />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${className}`}
        data-cursor
        data-label={cursorLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={`${baseClasses} ${className}`}
      data-cursor
      data-label={cursorLabel}
      {...rest}
    >
      {content}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   FRAMED VARIANT
   Border button with GSAP sweep-fill animation.
   
   The fill layer sweeps left → right on hover,
   and sweeps back right → left on mouse leave.
   
   The fill uses a massive nested circle (1000px)
   aligned to the wrapper's right edge to create
   a gentle, perfect circular arc.
   ═══════════════════════════════════════════════ */

function FramedButton({
  href,
  cursorLabel,
  children,
  className = '',
  ...rest
}: Omit<ButtonProps, 'variant'>) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const inverseRef = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const inverseTweenRef = useRef<gsap.core.Tween | null>(null);

  // Initialize fill position off-screen (left) via GSAP
  // so that GSAP's internal transform tracking is in sync.
  useEffect(() => {
    if (fillRef.current && inverseRef.current) {
      gsap.set(fillRef.current, { xPercent: -100, yPercent: 0 });
      gsap.set(inverseRef.current, { xPercent: 200, yPercent: -50 });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    const fill = fillRef.current;
    const inverse = inverseRef.current;
    if (!fill || !inverse) return;

    tweenRef.current?.kill();
    inverseTweenRef.current?.kill();

    // Ensure fill starts from the left
    gsap.set(fill, { xPercent: -100, yPercent: 0 });
    gsap.set(inverse, { xPercent: 200, yPercent: -50 });

    // Sweep in with a "charge" elastic effect.
    tweenRef.current = gsap.to(fill, {
      xPercent: -25,
      duration: 0.75,
      ease: 'back.inOut(1.5)',
    });

    // Inverse text animation to keep it perfectly stationary
    inverseTweenRef.current = gsap.to(inverse, {
      xPercent: 50,
      duration: 0.75,
      ease: 'back.inOut(1.5)',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const fill = fillRef.current;
    const inverse = inverseRef.current;
    if (!fill || !inverse) return;

    tweenRef.current?.kill();
    inverseTweenRef.current?.kill();

    // Reverse sweep back to the left
    tweenRef.current = gsap.to(fill, {
      xPercent: -100,
      duration: 0.6,
      ease: 'back.inOut(1.5)',
      onComplete: () => {
        gsap.set(fill, { xPercent: -100, yPercent: 0 });
        gsap.set(inverse, { xPercent: 200, yPercent: -50 });
      },
    });

    inverseTweenRef.current = gsap.to(inverse, {
      xPercent: 200,
      duration: 0.6,
      ease: 'back.inOut(1.5)',
    });
  }, []);

  const baseClasses = [
    'btn-framed',
    'magnetic',
    'group',
    'relative inline-flex items-center gap-3',
    'border border-paper/30 hover:border-paper/60',
    'px-8 py-4',
    'font-mono text-xs uppercase tracking-[.25em]',
    'text-paper overflow-hidden',
    'transition-[border-color] duration-300',
  ].join(' ');

  const inner = (
    <>
      {/* Wrapper animated by GSAP. Width is 200% of button. */}
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute top-0 left-0 h-full z-20 pointer-events-none"
        style={{ width: '200%' }}
      >
        {/* The liquid shape — a rectangle with a pronounced, perfect circular right edge. */}
        <span
          className="absolute bg-volt overflow-hidden"
          style={{
            right: 0,
            top: '50%',
            width: '100%',
            height: '120%',
            transform: 'translateY(-50%)',
            borderRadius: '0 50px 50px 0',
          }}
        >
          {/* Inverse container for pixel-perfect text clipping */}
          <span
            ref={inverseRef}
            className="absolute left-0 flex items-center gap-3 text-ink px-8"
            style={{
              width: '50%', // 50% of 200% = 100% of button width
              height: '100%',
              top: '50%',
              // yPercent: -50 is managed by GSAP
            }}
          >
            {children}
          </span>
        </span>
      </span>
      <span className="relative z-10 flex items-center gap-3">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${className}`}
        data-cursor
        data-label={cursorLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      className={`${baseClasses} ${className}`}
      data-cursor
      data-label={cursorLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {inner}
    </button>
  );
}
