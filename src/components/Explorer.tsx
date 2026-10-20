"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { GraphLink, GraphNode, Project, Skill } from "@/lib/types";
import type { GlobeSkill } from "./SkillsGlobe";
import { KnowledgeGraph } from "./KnowledgeGraph";

const SkillsGlobe = dynamic(() => import("./SkillsGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted">Loading globe…</div>
  ),
});

type View = "globe" | "graph";

export function Explorer({
  projects,
  skills,
  nodes,
  links,
}: {
  projects: Project[];
  skills: (Skill & { count: number })[];
  nodes: GraphNode[];
  links: GraphLink[];
}) {
  const router = useRouter();
  const [view, setView] = useState<View>("globe");
  const [selected, setSelected] = useState<string | null>(null);

  const skillById = useMemo(() => new Map(skills.map((s) => [s.id, s])), [skills]);
  const shown = useMemo(
    () => (selected ? projects.filter((p) => p.skills.includes(selected)) : projects),
    [projects, selected],
  );
  const globeSkills: GlobeSkill[] = skills;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Visualization" className="inline-flex rounded-full border border-line p-1 text-sm">
          {(["globe", "graph"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                view === v ? "bg-fg text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {v === "globe" ? "Skills globe" : "Knowledge graph"}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">
          {view === "globe"
            ? "Drag to rotate. Click a skill to filter projects."
            : "Hover to trace connections. Click a skill to filter, a project to open it."}
        </p>
      </div>

      <div className="relative h-[460px] overflow-hidden rounded-2xl border border-line bg-bg-elev md:h-[500px]">
        {view === "globe" ? (
          <SkillsGlobe skills={globeSkills} selected={selected} onSelect={setSelected} />
        ) : (
          <KnowledgeGraph
            nodes={nodes}
            links={links}
            selectedSkill={selected}
            onSelectSkill={setSelected}
            onOpenProject={(slug) => router.push(`/projects/${slug}`)}
          />
        )}
      </div>

      <div className="mt-6 flex min-h-9 flex-wrap items-center gap-2 text-sm" aria-live="polite">
        {selected ? (
          <>
            <span className="text-muted">Showing projects using</span>
            <span className="rounded-full bg-accent-soft px-3 py-1 font-medium text-accent">
              {skillById.get(selected)?.label}
            </span>
            <button onClick={() => setSelected(null)} className="text-muted underline underline-offset-4 hover:text-fg">
              Clear filter
            </button>
          </>
        ) : (
          <span className="text-muted">All {projects.length} projects</span>
        )}
      </div>

      <ul className="mt-3 divide-y divide-line border-y border-line">
        {shown.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/projects/${p.slug}`}
              className="group grid gap-2 py-5 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8"
            >
              <div>
                <p className="eyebrow">{p.kicker}</p>
                <h3 className="mt-1 font-display text-xl tracking-tight transition-colors group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-muted">{p.summary}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 md:max-w-xs md:justify-end">
                {p.skills.slice(0, 5).map((id) => (
                  <span key={id} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                    {skillById.get(id)?.label ?? id}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
