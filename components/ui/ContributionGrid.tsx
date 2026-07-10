import React from 'react';
import type { ContributionCalendar, ContributionDay } from '@/types/contributions';

interface ContributionGridProps {
  data: ContributionCalendar | 'loading' | 'error' | null;
  activeYear: number;
  onRetry?: () => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-paper/10';
  if (count <= 2) return 'bg-volt/25';
  if (count <= 5) return 'bg-volt/50';
  if (count <= 10) return 'bg-volt/75';
  return 'bg-volt';
}

export function ContributionGrid({ data, activeYear, onRetry }: ContributionGridProps) {
  if (data === 'error') {
    return (
      <div className="w-full h-full min-h-[160px] flex flex-col items-start justify-center border border-paper/10 p-6 bg-ink2/50">
        <div className="font-mono text-sm text-volt mb-4">{'> ERR: failed to sync contribution log'}</div>
        <button
          onClick={onRetry}
          className="font-mono text-xs uppercase tracking-widest text-ink bg-paper hover:bg-volt px-4 py-2 transition-colors"
        >
          Retry Sync
        </button>
      </div>
    );
  }

  const isLoading = data === 'loading' || !data;

  // Render skeleton if loading
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto custom-scrollbar pb-4 animate-pulse">
        <div className="min-w-[600px] w-full grid gap-[3px]" style={{ gridTemplateColumns: `auto repeat(53, minmax(0, 1fr))` }}>
          {/* Skeleton row 0: Months */}
          <div className="h-[1.25rem]"></div>
          {[...Array(53)].map((_, c) => (
             <div key={`skel-month-${c}`} className="h-[1.25rem]">
               {c % 4 === 0 && <div className="w-6 h-3 bg-paper/10 mt-1"></div>}
             </div>
          ))}
          {/* Skeleton rows 1-7: Days */}
          {[0, 1, 2, 3, 4, 5, 6].map((rowIndex) => (
            <React.Fragment key={`skel-row-${rowIndex}`}>
              <div className="text-[10px] font-mono text-paper/40 pr-2 flex items-center h-full">
                 {rowIndex === 1 ? 'Mon' : rowIndex === 3 ? 'Wed' : rowIndex === 5 ? 'Fri' : ''}
              </div>
              {[...Array(53)].map((_, c) => (
                <div key={`skel-cell-${rowIndex}-${c}`} className="aspect-square w-full rounded-[2px] bg-paper/10"></div>
              ))}
            </React.Fragment>
          ))}
        </div>
        
        {/* Legend Skeleton */}
        <div className="min-w-[600px] flex items-center justify-end gap-2 mt-4 text-[10px] font-mono text-paper/40 uppercase tracking-widest">
          <span>Less</span>
          <div className="flex gap-[3px] w-32">
             <div className="flex-1 aspect-square rounded-[2px] bg-paper/10"></div>
             <div className="flex-1 aspect-square rounded-[2px] bg-paper/10"></div>
             <div className="flex-1 aspect-square rounded-[2px] bg-paper/10"></div>
             <div className="flex-1 aspect-square rounded-[2px] bg-paper/10"></div>
             <div className="flex-1 aspect-square rounded-[2px] bg-paper/10"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    );
  }

  const calendar = data as ContributionCalendar;
  
  // Transform weeks array into a 7x53 matrix for CSS Grid
  const gridData = Array.from({ length: 7 }, () => new Array(calendar.weeks.length).fill(null));
  calendar.weeks.forEach((week, c) => {
    week.days.forEach(day => {
      gridData[day.weekday][c] = day;
    });
  });

  // Calculate month labels logic
  const monthLabels = calendar.weeks.map((week) => {
    if (week.days.length === 0) return null;
    const firstDay = week.days[0];
    const dateObj = new Date(firstDay.date);
    // Only show month label for the active year
    if (dateObj.getFullYear() !== activeYear) return null;
    return dateObj.getMonth();
  });
  
  let currentMonth = -1;
  const monthHeaders = monthLabels.map(month => {
    if (month !== null && month !== currentMonth) {
      currentMonth = month;
      return MONTHS[month];
    }
    return null;
  });

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <div className="min-w-[600px] w-full">
        {/* Responsive Grid */}
        <div 
          className="grid gap-[3px] w-full" 
          style={{ gridTemplateColumns: `auto repeat(${calendar.weeks.length}, minmax(0, 1fr))` }}
        >
          {/* Row 0: Month labels */}
          <div className="h-[1.25rem]"></div> {/* Empty top-left corner */}
          {monthHeaders.map((monthName, c) => (
             <div key={`month-${c}`} className="relative h-[1.25rem] text-[10px] font-mono text-paper/50 uppercase tracking-widest">
               {monthName && <span className="absolute left-0 overflow-visible whitespace-nowrap">{monthName}</span>}
             </div>
          ))}

          {/* Rows 1-7: Days */}
          {[0, 1, 2, 3, 4, 5, 6].map((rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              <div className="text-[10px] font-mono text-paper/40 pr-2 flex items-center h-full">
                 {rowIndex === 1 ? 'Mon' : rowIndex === 3 ? 'Wed' : rowIndex === 5 ? 'Fri' : ''}
              </div>
              {gridData[rowIndex].map((day, c) => {
                 if (!day) return <div key={`empty-${rowIndex}-${c}`} className="aspect-square w-full rounded-[2px] bg-transparent" />;
                 return (
                    <div
                      key={day.date}
                      className={`aspect-square w-full rounded-[2px] transition-colors duration-300 ${getIntensityClass(day.count)} hover:ring-1 hover:ring-volt cursor-crosshair relative group`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-max bg-ink2 border border-paper/10 px-2 py-1 text-[10px] font-mono text-paper/80">
                        {day.count} ops on {day.date}
                      </div>
                    </div>
                 );
              })}
            </React.Fragment>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-[10px] font-mono text-paper/40 uppercase tracking-widest">
          <span>Less</span>
          {/* Legend scales proportionally by using a fixed width flex container for the scale */}
          <div className="flex gap-[3px] w-32">
            <div className="flex-1 aspect-square rounded-[2px] bg-paper/10"></div>
            <div className="flex-1 aspect-square rounded-[2px] bg-volt/25"></div>
            <div className="flex-1 aspect-square rounded-[2px] bg-volt/50"></div>
            <div className="flex-1 aspect-square rounded-[2px] bg-volt/75"></div>
            <div className="flex-1 aspect-square rounded-[2px] bg-volt"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
