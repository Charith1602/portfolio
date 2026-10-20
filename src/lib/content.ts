import profileJson from "@/content/profile.json";
import experienceJson from "@/content/experience.json";
import projectsJson from "@/content/projects.json";
import papersJson from "@/content/papers.json";
import skillsJson from "@/content/skills.json";
import type {
  GraphLink,
  GraphNode,
  Paper,
  Profile,
  Project,
  Role,
  Skill,
} from "./types";

export const profile = profileJson as Profile;
export const experience = experienceJson as Role[];
export const projects = projectsJson as Project[];
export const papers = papersJson as Paper[];
export const skills = skillsJson as Skill[];

export const skillById = new Map(skills.map((s) => [s.id, s]));
export const roleById = new Map(experience.map((r) => [r.id, r]));
export const paperById = new Map(papers.map((p) => [p.id, p]));

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Only skills that at least one project uses, with a usage count. */
export function usedSkills() {
  const counts = new Map<string, number>();
  for (const p of projects) {
    for (const s of p.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return skills
    .filter((s) => counts.has(s.id))
    .map((s) => ({ ...s, count: counts.get(s.id) ?? 0 }));
}

export function buildGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const used = usedSkills();
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const orgIds = new Set(projects.map((p) => p.org));
  for (const r of experience) {
    if (orgIds.has(r.id)) nodes.push({ id: `org:${r.id}`, label: r.org, type: "org" });
  }
  for (const p of projects) {
    nodes.push({ id: `project:${p.slug}`, label: p.title.split(":")[0], type: "project", slug: p.slug });
    links.push({ source: `project:${p.slug}`, target: `org:${p.org}` });
    for (const s of p.skills) links.push({ source: `project:${p.slug}`, target: `skill:${s}` });
    for (const pid of p.papers ?? []) links.push({ source: `project:${p.slug}`, target: `paper:${pid}` });
  }
  for (const s of used) {
    nodes.push({ id: `skill:${s.id}`, label: s.label, type: "skill", category: s.category });
  }
  const paperIds = new Set(projects.flatMap((p) => p.papers ?? []));
  for (const pa of papers) {
    if (paperIds.has(pa.id)) nodes.push({ id: `paper:${pa.id}`, label: pa.title.split(":")[0].slice(0, 28), type: "paper" });
  }
  return { nodes, links };
}
