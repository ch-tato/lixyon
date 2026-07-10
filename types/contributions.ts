export interface ContributionDay {
  date: string;           // ISO date, e.g. "2026-03-14"
  count: number;
  weekday: number;        // 0=Sunday ... 6=Saturday, matches GitHub's convention
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionCalendar {
  year: number;
  totalContributions: number;
  weeks: ContributionWeek[];
  username: string;
}
