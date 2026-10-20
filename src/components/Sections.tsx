import Link from "next/link";
import { experience, paperById, papers, profile, projects, skillById } from "@/lib/content";
import { Reveal } from "./Reveal";

export function SectionHead({ id, eyebrow, title, lede }: { id: string; eyebrow: string; title: string; lede?: string }) {
  return (
    <div id={id} className="mb-10 max-w-2xl">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="font-display text-3xl tracking-tight md:text-4xl">{title}</h2>
      {lede && <p className="mt-3 text-lg text-muted">{lede}</p>}
    </div>
  );
}

export function FeaturedWork() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <SectionHead
        id="work"
        eyebrow="Selected work"
        title="Systems I have built and shipped"
        lede="From clinical vision research to production agents. Each one opens into a full case study."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <Link
              href={`/projects/${p.slug}`}
              className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-bg-elev p-6 transition-colors hover:border-accent"
            >
              <div>
                <p className="eyebrow">{p.kicker}</p>
                <h3 className="mt-3 font-display text-2xl leading-snug tracking-tight">{p.title}</h3>
                <p className="mt-3 text-muted">{p.summary}</p>
              </div>
              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="text-sm font-medium text-accent">{p.results[0]}</p>
                <span aria-hidden className="text-xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Research() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <SectionHead
        id="research"
        eyebrow="Research"
        title="Papers and preprints"
        lede="Two IEEE conference papers and an arXiv preprint, all started from the same question: how do we know a model really works?"
      />
      <ul className="grid gap-5 md:grid-cols-3">
        {papers.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05}>
            <li className="flex h-full flex-col rounded-2xl border border-line p-6">
              <p className="eyebrow">
                {p.status} · {p.year}
              </p>
              <h3 className="mt-3 font-display text-lg leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.venue}</p>
              <p className="mt-4 text-sm">{p.summary}</p>
              {p.href && (
                <a href={p.href} className="mt-auto pt-4 text-sm font-medium text-accent underline underline-offset-4">
                  Read on arXiv
                </a>
              )}
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export function Journey() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <SectionHead
        id="journey"
        eyebrow="Journey"
        title="Where I have worked and studied"
      />
      <ol className="relative space-y-10 border-l border-line pl-8">
        {experience.map((r, i) => (
          <Reveal key={r.id} delay={i * 0.04}>
            <li className="relative">
              <span aria-hidden className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-bg" />
              <p className="eyebrow">{r.period}</p>
              <h3 className="mt-1 font-display text-xl tracking-tight">
                {r.title} <span className="text-muted">· {r.org}</span>
              </h3>
              <p className="mt-2 max-w-2xl text-muted">{r.blurb}</p>
              <ul className="mt-3 max-w-2xl list-disc space-y-1.5 pl-5 text-sm marker:text-muted">
                {r.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-16">
      <div id="contact" className="rounded-3xl border border-line bg-bg-elev p-8 md:p-12">
        <p className="eyebrow mb-3">Contact</p>
        <h2 className="max-w-2xl font-display text-3xl tracking-tight md:text-4xl">
          Interested in agentic systems, evaluation, or research collaboration? Let&apos;s talk.
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            {profile.email}
          </a>
          {profile.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-fg"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        © {profile.name}
      </p>
    </section>
  );
}

// Re-exported so project pages can resolve ids without importing content twice.
export { paperById, skillById };
