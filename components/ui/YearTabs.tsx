interface YearTabsProps {
  years: number[];
  activeYear: number;
  onYearSelect: (year: number) => void;
}

export function YearTabs({ years, activeYear, onYearSelect }: YearTabsProps) {
  return (
    <div className="flex flex-row md:flex-col justify-start gap-2 h-full md:pt-[1.5rem] overflow-x-auto touch-pan-x custom-scrollbar pb-2 md:pb-0">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearSelect(year)}
          className={`font-mono text-[10px] md:text-xs uppercase tracking-widest md:tracking-[.1em] px-4 md:px-3 py-2 md:py-1.5 transition-colors duration-200 text-center md:text-left flex-1 md:flex-none ${
            activeYear === year
              ? 'bg-volt text-ink'
              : 'text-paper/50 hover:text-paper hover:bg-paper/5'
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
