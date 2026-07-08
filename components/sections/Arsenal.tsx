'use client';
import { SkillCard } from '@/components/ui/SkillCard';
import { Marquee } from '@/components/ui/Marquee';
import { BlockReveal } from '@/components/ui/BlockReveal';

const skills = [
  {
    index: '01',
    category: 'OFFENSIVE',
    title: ['Red Team', 'Operations'] as [string, string],
    items: [
      'Burp Suite',
      'Wireshark',
      'Nmap / Metasploit',
      'Reverse Engineering',
      'Digital Forensics',
      'CVE Research & Disclosure',
    ],
  },
  {
    index: '02',
    category: 'BACKEND',
    title: ['Backend', 'Core'] as [string, string],
    items: [
      'Go / Python / C++',
      'PostgreSQL / Redis',
      'gRPC / WebSockets / REST',
      'Microservices Architecture',
      'High-Concurrency Tuning',
      'Memory Management',
    ],
  },
  {
    index: '03',
    category: 'DEVOPS',
    title: ['Cloud &', 'DevOps'] as [string, string],
    items: [
      'Docker / Kubernetes',
      'Ansible / Terraform',
      'Jenkins / GitHub Actions',
      'AWS / GCP / Azure',
      'Prometheus / Grafana',
      'Zero-Trust Networking',
    ],
  },
];

const marqueeItems = [
  '— OPEN TO WORK',
  '— CLEARANCE: SECRET',
  '— BE DEVELOPER / DEVOPS ENGINEER',
  '— REMOTE / ON SITE / SURABAYA',
  '— AVAILABLE FOR Q3 2026 ENGAGEMENTS',
];

export function Arsenal() {
  return (
    <section id="skills" className="relative px-5 md:px-10 py-28 md:py-44 border-t border-paper/10">
      <div className="grid grid-cols-12 gap-4 mb-12 md:mb-20">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-volt mb-3">[02] ARSENAL</div>
          <div className="font-mono text-[10px] uppercase tracking-[.3em] text-paper/40">$ ls -la /skills</div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="section-heading uppercase">
            <BlockReveal>Three disciplines.</BlockReveal>
            <br />
            <BlockReveal className="text-volt italic">One operator.</BlockReveal>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-paper/10 border border-paper/10">
        {skills.map((skill) => (
          <SkillCard key={skill.index} {...skill} />
        ))}
      </div>

      {/* Marquee 2 */}
      <div className="mt-16 md:mt-20 -mx-5 md:-mx-10">
        <Marquee
          items={marqueeItems}
          direction="reverse"
          speed="slow"
          separator={<span className="px-5 text-volt">●</span>}
          trackClassName="font-mono text-xs md:text-sm uppercase tracking-[.3em] text-paper/40"
          className=""
        />
      </div>
    </section>
  );
}
