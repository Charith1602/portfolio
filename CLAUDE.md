# Portfolio site: maintainer guide

Personal portfolio for Charith Rage (AI/ML engineer, applying to US MS programs). Next.js 16 (App Router, Cache Components on), TypeScript, Tailwind v4, Motion, react-three-fiber, d3-force.

## How content works

All site content lives in `src/content/*.json`. Components never hard-code facts.

- `profile.json`: headline, summary, hero stats, public links.
- `experience.json`: roles and education (timeline). `id` is referenced by projects via `org`.
- `projects.json`: case studies. Each project lists `skills` (ids from `skills.json`) and optional `papers` (ids from `papers.json`).
- `skills.json`: skill ids, labels and a `category` (agents, retrieval, vision, ml, data, cloud, engineering).
- `papers.json`: publications.

The skills globe, knowledge graph, filter and project pages are all generated from these files. To add a project, add one object to `projects.json`; use only skill ids that exist (add new ones to `skills.json` first).

## Rules for any agent editing this repo

1. Work on a branch and open a pull request. Never push to `main`.
2. Do not invent facts: no made-up metrics, paper titles, dates, links or collaborators. If a detail is missing, leave the field out and say so in the PR.
3. Keep client and employer-confidential details out. Client companies are described generically (for example "a global restaurant client") unless Charith has approved naming them.
4. Never publish private material: the SOP, phone number, exam ranks, application strategy, or anything from his notes marked private.
5. Keep `Reveal`-style motion subtle and respect `prefers-reduced-motion`. Keep both themes working: use the CSS variables in `globals.css`, never raw hex in components.
6. Before opening a PR run `npm run lint && npx tsc --noEmit && npm run build`.

## Next.js 16 notes

Cache Components is enabled. Avoid `new Date()` or other unstable values in server components, and do not use route segment config such as `dynamicParams`. When unsure about an API, read the docs in `node_modules/next/dist/docs/`.

## Assets

Portrait goes at `public/photo.jpg` (shown automatically; a placeholder shows until it exists). A resume PDF at `public/resume.pdf` can be linked from `profile.json` once an up-to-date one exists.
