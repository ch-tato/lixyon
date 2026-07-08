'use client';
import { BlockReveal } from './BlockReveal';

interface SkillCardProps {
  index: string;
  category: string;
  title: [string, string];
  items: string[];
}

export function SkillCard({ index, category, title, items }: SkillCardProps) {
  return (
    <div className="skill-card bg-ink p-7 md:p-12" data-cursor data-label={index}>
      <div className="flex justify-between items-start mb-8">
        <div className="font-mono text-[10px] uppercase tracking-[.3em] opacity-60">
          {index} / {category}
        </div>
        <div className="skill-arrow font-display text-2xl">↗</div>
      </div>
      <h3 className="font-display text-4xl md:text-5xl uppercase mb-8 leading-[.9]">
        <BlockReveal>{title[0]}</BlockReveal>
        <br />
        <BlockReveal>{title[1]}</BlockReveal>
      </h3>
      <ul className="space-y-3 font-mono text-xs md:text-sm">
        {items.map((item) => (
          <li key={item}>↳ {item}</li>
        ))}
      </ul>
    </div>
  );
}
