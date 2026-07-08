export const EASE = {
  lenis: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  cursorLerp: 0.18,
  magneticOut: 'power3.out',
  magneticBack: 'elastic.out(1, 0.4)',
  wipeIn: 'power2.in',
  wipeOut: 'power2.out',
  fade: 'power3.out',
  count: 'power2.out',
} as const;

export const DURATION = {
  magneticMove: 0.5,
  magneticReturn: 0.6,
  wipeIn: 0.3,
  wipeOut: 0.5,
  fadeUp: 1.0,
  countUp: 2.0,
  preloaderCount: 2.8,
  preloaderExit: 1.1,
  preloaderExitDelay: 0.35,
  scrambleTick: 35, // ms per frame
  marquee: 28,
  marqueeSlow: 50,
} as const;

export const Z = {
  cursor: 9999,
  grain: 9998,
  preloader: 10000,
  nav: 50,
} as const;
