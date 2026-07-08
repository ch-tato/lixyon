'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from '@/lib/gsap';
import { ScrambleText, type ScrambleTextHandle } from '@/components/ui/ScrambleText';
import { Marquee } from '@/components/ui/Marquee';

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<ScrambleTextHandle>(null);
  const line2Ref = useRef<ScrambleTextHandle>(null);
  const line3Ref = useRef<ScrambleTextHandle>(null);

  // Footer scramble triggered on scroll into view per source
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        const refs = [line1Ref, line2Ref, line3Ref];
        refs.forEach((ref, index) => {
          setTimeout(() => {
            ref.current?.play();
          }, index * 150);
        });
      },
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="px-5 md:px-10 py-12 border-t border-paper/10 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
        <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/50 max-w-xs">
          {/* §8.7: kept truncated copy as-is — flagged for user review */}
          LIXYON/33 is the operating alias of a systems architect and offensive security engineer based between
          Surabaya. Available for select engagements.
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/50 text-left md:text-right">
          <div>© 2026 // ALL RIGHTS RESERVED</div>
          <div className="mt-1">BUILT WITH GSAP × LENIS × SPLITTYPE</div>
          <div className="mt-1 text-volt">— END OF TRANSMISSION —</div>
        </div>
      </div>

      <div className="footer-mega uppercase text-paper/90 leading-none whitespace-nowrap" id="footerMega">
        <ScrambleText ref={line1Ref} text="LIXYON" />
        <ScrambleText ref={line2Ref} text="/" className="text-volt" />
        <ScrambleText ref={line3Ref} text="33" />
      </div>

      <div className="mt-8 -mx-5 md:-mx-10">
        <Marquee
          items={[
            '— LET\'S BUILD SOMETHING IMPENETRABLE —',
            '— BACKEND × DEVOPS × SECURITY —',
          ]}
          speed="slow"
          separator={<span className="px-5 text-volt">●</span>}
          trackClassName="font-mono text-[10px] uppercase tracking-[.3em] text-paper/30"
        />
      </div>
    </footer>
  );
}
