import { BlockReveal } from '@/components/ui/BlockReveal';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { ContributionGraph } from '@/components/ui/ContributionGraph';
import projectsData from '@/data/projects.json';
import type { ProjectsData } from '@/types/project';

const projects = projectsData as ProjectsData;

export function Fieldwork() {
  return (
    <section id="projects" className="relative px-5 md:px-10 py-28 md:py-44 border-t border-paper/10">
      <div className="grid grid-cols-12 gap-4 mb-12 md:mb-24">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-volt mb-3">[03] FIELDWORK</div>
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/40">$ cat /var/log/ops.log</div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="section-heading uppercase">
            <BlockReveal>Selected</BlockReveal>
            <br />
            <BlockReveal className="text-volt italic">operations.</BlockReveal>
          </h2>
        </div>
      </div>

      {projects.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          reverse={i % 2 === 1}
          isLast={i === projects.length - 1}
        />
      ))}
      
      <ContributionGraph />
    </section>
  );
}
