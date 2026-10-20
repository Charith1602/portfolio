import { profile } from "@/lib/content";
import { Portrait } from "./Portrait";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:pt-24">
      <div className="grid items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Reveal>
            <p className="eyebrow mb-5">
              {profile.role} · {profile.org} · {profile.location}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display text-4xl leading-[1.08] tracking-tight md:text-6xl">
              {profile.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
              {profile.summary.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#explore"
                className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
              >
                Explore my work
              </a>
              <a
                href="#contact"
                className="rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-fg"
              >
                Get in touch
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="justify-self-center md:justify-self-end">
          <Portrait />
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {profile.stats.map((s) => (
            <div key={s.label} className="bg-bg-elev p-5">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display text-4xl tracking-tight text-accent">{s.value}</span>
                <span className="mt-1 block text-sm font-medium">{s.label}</span>
                <span className="mt-1 block text-xs leading-snug text-muted">{s.context}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
