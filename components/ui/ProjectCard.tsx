'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { BlockReveal } from './BlockReveal';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  reverse: boolean;
  isLast?: boolean;
}

export function ProjectCard({ project, reverse, isLast = false }: ProjectCardProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  // Parallax effect per §4.7
  useGSAP(() => {
    const img = imgRef.current;
    if (!img) return;

    gsap.fromTo(
      img,
      { yPercent: 0 },
      {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  }, { scope: cardRef });

  // Fade-up for description
  useGSAP(() => {
    const el = cardRef.current;
    if (!el) return;

    const fadeEls = el.querySelectorAll('.fade-up');
    fadeEls.forEach((fadeEl) => {
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
  }, { scope: cardRef });

  const borderClasses = isLast
    ? 'border-t border-b border-paper/10'
    : 'border-t border-paper/10';

  return (
    <article
      ref={cardRef}
      className={`project-card group grid grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 ${borderClasses}`}
      data-cursor
      data-label="OPEN"
    >
      {/* Text column */}
      <div
        className={`col-span-12 md:col-span-5 flex flex-col justify-between ${
          reverse ? '' : 'order-2 md:order-1'
        }`}
      >
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="font-display text-7xl md:text-8xl text-paper/15 leading-none">
              {project.index}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[.3em] text-volt">
              {project.caseCode} // {project.year}
            </div>
          </div>
          <h3 className="font-display text-5xl md:text-6xl uppercase mb-5 leading-[.9]">
            <BlockReveal>{project.title[0]}</BlockReveal>
            <br />
            <BlockReveal>{project.title[1]}</BlockReveal>
          </h3>
          <p className="text-paper/70 text-sm md:text-base leading-relaxed max-w-md mb-6 fade-up">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[.15em]">
            {project.techStack.map((tech) => (
              <span key={tech} className="px-3 py-1 border border-paper/20">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <a
          href={project.href}
          className="magnetic group/link inline-flex w-fit items-center gap-3 bg-volt text-ink px-8 py-4 font-mono text-xs uppercase tracking-[.25em] hover:bg-paper transition-colors mt-8"
          data-cursor
          data-label="OPEN"
        >
          <span>Open Case File</span>
          <span className="transition-transform group-hover/link:translate-x-2">→</span>
        </a>
      </div>

      {/* Image column */}
      <div
        className={`col-span-12 md:col-span-7 ${
          reverse ? '' : 'order-1 md:order-2'
        }`}
      >
        <div className="project-img-wrap aspect-[4/3] bg-ink2">
          <Image
            ref={imgRef}
            className="project-img"
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            unoptimized
          />
        </div>
      </div>
    </article>
  );
}
