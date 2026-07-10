'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ContributionCalendar } from '@/types/contributions';
import { YearTabs } from './YearTabs';
import { ContributionGrid } from './ContributionGrid';
import { Button } from '@/components/ui/Button';
import { gsap } from '@/lib/gsap';

type CacheData = Record<number, ContributionCalendar | 'loading' | 'error'>;

export function ContributionGraph() {
  const currentYear = new Date().getFullYear();
  const [activeYear, setActiveYear] = useState<number>(currentYear);
  const [cache, setCache] = useState<CacheData>({});
  
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const graphRef = useRef<HTMLDivElement>(null);

  const fetchYear = useCallback(async (year: number) => {
    if (cache[year] && cache[year] !== 'error') return;

    setCache((prev) => ({ ...prev, [year]: 'loading' }));

    try {
      const res = await fetch(`/api/github-contributions?year=${year}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data: ContributionCalendar = await res.json();
      setCache((prev) => ({ ...prev, [year]: data }));
    } catch (err) {
      console.error('Error fetching contributions:', err);
      setCache((prev) => ({ ...prev, [year]: 'error' }));
    }
  }, [cache]);

  useEffect(() => {
    fetchYear(activeYear);
  }, [activeYear, fetchYear]);

  // Entrance animation
  useEffect(() => {
    if (graphRef.current) {
      const matchMedia = gsap.matchMedia();
      
      matchMedia.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          gsap.fromTo(
            graphRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: graphRef.current,
                start: 'top 85%',
              }
            }
          );
        }
      );
      
      return () => matchMedia.revert();
    }
  }, []);

  const handleRetry = () => {
    fetchYear(activeYear);
  };

  const activeData = cache[activeYear] || 'loading';
  const displayUsername = activeData !== 'loading' && activeData !== 'error' ? activeData.username : '...';

  return (
    <div ref={graphRef} className="mt-20 md:mt-32 border border-paper/10 bg-ink2/30 p-6 md:p-10 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-32 flex-shrink-0">
        <YearTabs 
          years={years} 
          activeYear={activeYear} 
          onYearSelect={setActiveYear} 
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/40 mb-3">
              $ curl api.github.com/users/{displayUsername}/events
            </div>
            <div className="font-mono text-xs uppercase tracking-[.2em] text-paper/60">
              {activeData !== 'loading' && activeData !== 'error' 
                ? `${activeData.totalContributions} contributions in ${activeYear}`
                : `... contributions in ${activeYear}`}
            </div>
          </div>
          
          <Button
            variant="unframed"
            href={displayUsername !== '...' ? `https://github.com/${displayUsername}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            View Profile <span className="text-[10px]">↗</span>
          </Button>
        </div>
        <ContributionGrid 
          data={activeData} 
          activeYear={activeYear} 
          onRetry={handleRetry} 
        />
      </div>
    </div>
  );
}
