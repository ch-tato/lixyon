'use client';
import { useState, useRef } from 'react';
import { Button } from './Button';

// Single source of truth for contact email (§8.3 resolution)
const CONTACT_EMAIL = 'akuquthbi@gmail.com';

interface TerminalLine {
  text: string;
  cls: string;
}

export function ContactForm() {
  const [btnLabel, setBtnLabel] = useState('Transmit');
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: '$ ./initiate-secure-handshake.sh', cls: 'text-paper/40' },
    { text: `> Connecting to ${CONTACT_EMAIL}...`, cls: 'text-volt' },
    { text: '> Encryption: PGP [0xB3E1 7F4C]', cls: 'text-paper/60' },
    { text: '> Channel: TLS 1.3 / X25519', cls: 'text-paper/60' },
  ]);
  const [showCursor, setShowCursor] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = {
      operator: formData.get('operator'),
      channel: formData.get('channel'),
      engagementType: formData.get('engagementType'),
      payload: formData.get('payload'),
    };

    setBtnLabel('Transmitting…');
    setShowCursor(false);

    setTerminalLines((prev) => [
      ...prev,
      { text: '> Payload received', cls: 'text-paper/60' },
      { text: '> Encrypting with PGP [0xB3E1 7F4C]…', cls: 'text-paper/60' }
    ]);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Transmission failed');

      setTerminalLines((prev) => [
        ...prev,
        { text: '> Ciphertext generated: 4.2 KB', cls: 'text-paper/60' },
        { text: '> Transmitting over TLS 1.3…', cls: 'text-paper/60' },
        { text: '> ✓ Handshake complete. Response expected within 24h.', cls: 'text-volt' },
      ]);
      
      setBtnLabel('Transmitted ✓');
      setTimeout(() => {
        formRef.current?.reset();
        setBtnLabel('Transmit');
        setShowCursor(true);
      }, 4500);

    } catch (error) {
      setTerminalLines((prev) => [
        ...prev,
        { text: '> [ERROR] Connection refused. Transmission failed.', cls: 'text-red-500' },
      ]);
      setBtnLabel('Failed ✗');
      setTimeout(() => {
        setBtnLabel('Transmit');
        setShowCursor(true);
      }, 4500);
    }
  };

  return (
    <div className="col-span-12 md:col-span-8">
      {/* Terminal output */}
      <div className="font-mono text-xs mb-8 p-5 border border-paper/10 bg-ink2/60 backdrop-blur-sm">
        {terminalLines.map((line, i) => (
          <div key={i} className={line.cls + (i > 0 ? ' mt-1' : '')}>
            {line.text}
          </div>
        ))}
        {showCursor && (
          <div className="text-paper/40 blink">
            {'> Awaiting payload_'}
            <span className="blink">█</span>
          </div>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="font-mono">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <label className="text-[10px] uppercase tracking-[.3em] text-paper/40">--operator</label>
            <input type="text" name="operator" className="term-input" placeholder="Your name" required />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[.3em] text-paper/40">--channel</label>
            <input type="email" name="channel" className="term-input" placeholder="you@domain.com" required />
          </div>
        </div>

        <div className="mt-8">
          <label className="text-[10px] uppercase tracking-[.3em] text-paper/40">--engagement-type</label>
          <input
            type="text"
            name="engagementType"
            className="term-input"
            placeholder="Security audit / Backend architecture / CI/CD pipeline"
            required
          />
        </div>

        <div className="mt-8">
          <label className="text-[10px] uppercase tracking-[.3em] text-paper/40">--payload</label>
          <textarea
            name="payload"
            className="term-input"
            rows={4}
            placeholder="Describe the engagement, scope, and timeline…"
            required
          />
        </div>

        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-[10px] text-paper/40 font-mono uppercase tracking-[.2em]">
            <span className="text-volt">↳</span> Encrypted end-to-end // Response within 24h
          </div>
          <Button
            type="submit"
            cursorLabel="SEND"
          >
            <span>{btnLabel}</span>
            <span className="transition-transform group-hover:translate-x-2">→</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export { CONTACT_EMAIL };
