import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, paperById, projects, roleById, skillById } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: `${p.title} · Charith Rage`, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const role = roleById.get(p.org);
  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-12">
      <Link href="/#work" className="text-sm text-muted hover:text-fg">
        ← All work
      </Link>

      <p className="eyebrow mt-8">{p.kicker}</p>
      <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">{p.title}</h1>
      <p className="mt-4 text-sm text-muted">
        {role?.org} · {p.period}
      </p>
      <p className="mt-6 text-xl leading-relaxed text-muted">{p.summary}</p>

      <section className="mt-12">
        <h2 className="eyebrow mb-3">The problem</h2>
        <p className="text-lg leading-relaxed">{p.problem}</p>
      </section>

      <section className="mt-10">
        <h2 className="eyebrow mb-3">Approach</h2>
        <ul className="list-disc space-y-2 pl-5 text-lg leading-relaxed marker:text-muted">
          {p.approach.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="eyebrow mb-3">Results</h2>
        <ul className="space-y-3">
          {p.results.map((r) => (
            <li key={r} className="rounded-xl border border-line bg-bg-elev px-4 py-3 text-lg">
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="eyebrow mb-3">Built with</h2>
        <div className="flex flex-wrap gap-2">
          {p.skills.map((id) => (
            <span key={id} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
              {skillById.get(id)?.label ?? id}
            </span>
          ))}
        </div>
      </section>

      {(p.papers?.length || p.links?.length) && (
        <section className="mt-10">
          <h2 className="eyebrow mb-3">Read more</h2>
          <ul className="space-y-2">
            {p.papers?.map((id) => {
              const paper = paperById.get(id);
              return paper ? (
                <li key={id}>
                  {paper.href ? (
                    <a href={paper.href} className="text-accent underline underline-offset-4">
                      {paper.title} ({paper.venue}, {paper.year})
                    </a>
                  ) : (
                    <span>
                      {paper.title} ({paper.venue}, {paper.year})
                    </span>
                  )}
                </li>
              ) : null;
            })}
            {p.links?.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-accent underline underline-offset-4">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link
        href={`/projects/${next.slug}`}
        className="mt-16 flex items-center justify-between rounded-2xl border border-line p-5 transition-colors hover:border-accent"
      >
        <span>
          <span className="eyebrow block">Next project</span>
          <span className="font-display text-lg">{next.title}</span>
        </span>
        <span aria-hidden className="text-xl">
          →
        </span>
      </Link>
    </main>
  );
}
