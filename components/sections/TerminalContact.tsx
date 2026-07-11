'use client';
import { BlockReveal } from '@/components/ui/BlockReveal';
import { ContactForm, CONTACT_EMAIL } from '@/components/ui/ContactForm';

export function TerminalContact() {
  return (
    <section id="contact" className="relative px-5 md:px-10 py-28 md:py-44 border-t border-paper/10 grid-bg">
      <div className="grid grid-cols-12 gap-4 mb-12 md:mb-20">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-volt mb-3">[04] UPLINK</div>
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/40">
            $ ./initiate-handshake.sh
          </div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="section-heading uppercase">
            <BlockReveal>Establish</BlockReveal>
            <br />
            <BlockReveal className="text-volt italic">connection.</BlockReveal>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-8">
        <div className="col-span-12 md:col-span-4">
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/50 mb-3">/status</div>
          <div className="font-mono text-sm text-volt mb-8 flex items-center gap-2">
            <span className="blink">●</span> AVAILABLE — Q3 2026
          </div>

          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/50 mb-3">/channels</div>
          <div className="space-y-3 font-mono text-sm mb-8">
            {/* §8.3 fix: mailto uses CONTACT_EMAIL as single source of truth */}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="magnetic block hover:text-volt transition-colors"
              data-cursor
              data-label="MAIL"
            >
              → {CONTACT_EMAIL}
            </a>
            <a href="https://github.com/ch-tato" className="magnetic block hover:text-volt transition-colors" data-cursor data-label="GIT">
              → github.com/ch-tato
            </a>
            <a href="https://www.linkedin.com/in/muhammad-abqori-b00443354/" className="magnetic block hover:text-volt transition-colors" data-cursor data-label="LINKEDIN">
              → linkedin.com/in/me/
            </a>
            <a href="/cv.pdf" className="magnetic block hover:text-volt transition-colors" data-cursor data-label="CV">
              → cv.pdf [encrypted]
            </a>
          </div>

          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/50 mb-3">/disciplines</div>
          <div className="font-mono text-xs text-paper/60 leading-relaxed">
            Security Architecture
            <br />
            Backend Systems Engineering
            <br />
            Cloud Infrastructure (DevOps)
            <br />
            Red Team Operations
            <br />
            Incident Response
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
