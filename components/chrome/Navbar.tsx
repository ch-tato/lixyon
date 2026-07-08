'use client';
import { useEffect, useState } from 'react';
import { useLenisInstance } from '@/components/providers/SmoothScrollProvider';

function LiveClock() {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    }
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}

export function Navbar() {
  const lenis = useLenisInstance();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.length > 1 && lenis) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.4 });
    }
  };

  const navLinks = [
    { href: '#whoami', label: '[01] Identity' },
    { href: '#skills', label: '[02] Arsenal' },
    { href: '#projects', label: '[03] Fieldwork' },
    { href: '#contact', label: '[04] Uplink' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-5 md:px-10 py-5 flex justify-between items-center mix-blend-difference">
      <a
        href="#top"
        className="font-display text-2xl tracking-wider text-paper magnetic"
        data-cursor
        onClick={(e) => handleNav(e, '#top')}
      >
        LIXYON<span className="text-volt">/</span>33
      </a>

      <div className="hidden md:flex gap-7 font-mono text-[10px] uppercase tracking-[.25em] text-paper">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav-link magnetic"
            data-cursor
            onClick={(e) => handleNav(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="font-mono text-[10px] text-volt uppercase tracking-[.25em] hidden md:flex items-center gap-2">
        <span className="blink">●</span> <LiveClock />
      </div>

      {/* Mobile: just blinking dot (§8.8 notes no mobile menu in prototype) */}
      <div className="md:hidden font-mono text-[10px] text-volt uppercase tracking-[.25em]">
        <span className="blink">●</span>
      </div>
    </nav>
  );
}
