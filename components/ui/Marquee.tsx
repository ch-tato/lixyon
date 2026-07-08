'use client';

interface MarqueeProps {
  items: string[];
  direction?: 'normal' | 'reverse';
  speed?: 'default' | 'slow';
  separator?: React.ReactNode;
  className?: string;
  trackClassName?: string;
}

export function Marquee({
  items,
  direction = 'normal',
  speed = 'default',
  separator = <span className="px-6 text-volt">✦</span>,
  className = '',
  trackClassName = '',
}: MarqueeProps) {
  const trackClasses = [
    'marquee-track',
    direction === 'reverse' ? 'reverse' : '',
    speed === 'slow' ? 'slow' : '',
    trackClassName,
  ]
    .filter(Boolean)
    .join(' ');

  // Duplicate content ×2 for seamless loop
  const content = items.flatMap((item, i) => [
    <span key={`item-${i}`} className="px-6">
      {item}
    </span>,
    <span key={`sep-${i}`}>{separator}</span>,
  ]);

  return (
    <div className={`marquee ${className}`}>
      <div className={trackClasses}>
        {content}
        {content}
      </div>
    </div>
  );
}
