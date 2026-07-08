export interface Project {
  /** Stable slug, also used as the React key — e.g. "case-001" */
  id: string;
  /** Display case code, e.g. "CASE_001" */
  caseCode: string;
  /** 2-digit index label rendered large/faint behind the case code, e.g. "01" */
  index: string;
  year: number;
  /** Two-line title, rendered as stacked <BlockReveal> lines */
  title: [string, string];
  description: string;
  techStack: string[];
  image: {
    src: string;
    alt: string;
  };
  /** Destination for the "Open Case File" CTA */
  href: string;
}

export type ProjectsData = Project[];
