export type SkillCategory =
  | "agents"
  | "retrieval"
  | "vision"
  | "ml"
  | "data"
  | "cloud"
  | "engineering";

export interface Skill {
  id: string;
  label: string;
  category: SkillCategory;
}

export interface Profile {
  name: string;
  headline: string;
  role: string;
  org: string;
  location: string;
  summary: string[];
  email: string;
  links: { label: string; href: string }[];
  stats: { value: string; label: string; context: string }[];
}

export interface Role {
  id: string;
  org: string;
  title: string;
  period: string;
  blurb: string;
  bullets: string[];
}

export interface Project {
  slug: string;
  title: string;
  kicker: string;
  org: string; // role id
  period: string;
  summary: string;
  problem: string;
  approach: string[];
  results: string[];
  skills: string[]; // skill ids
  papers?: string[]; // paper ids
  links?: { label: string; href: string }[];
  featured?: boolean;
}

export interface Paper {
  id: string;
  title: string;
  venue: string;
  year: number;
  status: string;
  summary: string;
  href?: string;
}

export type GraphNodeType = "project" | "skill" | "paper" | "org";

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  category?: SkillCategory;
  slug?: string;
}

export interface GraphLink {
  source: string;
  target: string;
}
