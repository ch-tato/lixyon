interface YearTabsProps {
  years: number[];
  activeYear: number;
  onYearSelect: (year: number) => void;
}

export function YearTabs({ years, activeYear, onYearSelect }: YearTabsProps) {
  return (
    <div className="flex flex-row md:flex-col justify-start md:justify-start gap-2 h-full md:pt-[1.5rem]">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearSelect(year)}
          className={`font-mono text-xs uppercase tracking-[.1em] px-3 py-1.5 transition-colors duration-200 text-left ${
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
