import { Hero } from "@/components/Hero";
import { Explorer } from "@/components/Explorer";
import { Contact, FeaturedWork, Journey, Research, SectionHead } from "@/components/Sections";
import { buildGraph, projects, usedSkills } from "@/lib/content";

export default function Home() {
  const { nodes, links } = buildGraph();
  return (
    <main>
      <Hero />
      <FeaturedWork />
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHead
          id="explore"
          eyebrow="Explore"
          title="See how the work connects"
          lede="Every project is tagged with the skills it used. Spin the globe or trace the graph, then filter the list below."
        />
        <Explorer projects={projects} skills={usedSkills()} nodes={nodes} links={links} />
      </section>
      <Research />
      <Journey />
      <Contact />
    </main>
  );
}
