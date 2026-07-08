'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { BlockReveal } from '@/components/ui/BlockReveal';
import { StatCounter } from '@/components/ui/StatCounter';

export function WhoAmI() {
  const sectionRef = useRef<HTMLElement>(null);

  // Fade-up animations for paragraphs
  useGSAP(() => {
    const el = sectionRef.current;
    if (!el) return;

    el.querySelectorAll('.fade-up').forEach((fadeEl) => {
      gsap.from(fadeEl, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: fadeEl,
          start: 'top 85%',
          once: true,
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section id="whoami" className="relative px-5 md:px-10 py-28 md:py-44" ref={sectionRef}>
      <div className="grid grid-cols-12 gap-4 md:gap-8">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-volt mb-3">[01] IDENTITY</div>
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/40">$ whoami --verbose</div>
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/30 mt-1">└─ executing…</div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="section-heading uppercase">
            <BlockReveal>I architect systems</BlockReveal>
            <br />
            <BlockReveal className="text-volt italic">that don&apos;t break.</BlockReveal>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-12 md:mt-16 max-w-5xl">
            <p className="text-paper/75 text-base md:text-lg leading-relaxed fade-up">
              For three years I&apos;ve operated in the trenches between infrastructure automation and offensive
              security. I deploy scalable backends, configure immutable clusters, and aggressively pen-test every
              endpoint.
            </p>
            <p className="text-paper/75 text-base md:text-lg leading-relaxed fade-up">
              Infrastructure that isn&apos;t hardened by default is a liability. A fast network with open ports is a
              time bomb. I engineer for resilience, scale, and zero trust.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 mt-16 md:mt-24 border-t border-paper/10 pt-10">
            <StatCounter value={514} label="Contributions Commited" accent />
            <StatCounter value={3} label="Years in Field" />
            <StatCounter value={14} label="Products Shipped" accent />
            <StatCounter value={3.71} suffix="/4.00" decimals={2} label="Informatics Engineering GPA" />
          </div>
        </div>
      </div>
    </section>
  );
}
