"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import type { GraphLink, GraphNode } from "@/lib/types";
import { categoryColor, useThemeColors } from "@/lib/useThemeColors";

type SimNode = GraphNode & SimulationNodeDatum;
type SimLink = SimulationLinkDatum<SimNode>;

const RADIUS: Record<GraphNode["type"], number> = { project: 9, org: 8, paper: 7, skill: 5 };

export function KnowledgeGraph({
  nodes,
  links,
  selectedSkill,
  onSelectSkill,
  onOpenProject,
}: {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedSkill: string | null;
  onSelectSkill: (id: string | null) => void;
  onOpenProject: (slug: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const hoverRef = useRef<string | null>(null);
  const colors = useThemeColors();
  const colorsRef = useRef(colors);
  const selectedRef = useRef(selectedSkill);
  const [size, setSize] = useState({ w: 640, h: 460 });
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);
  useEffect(() => {
    selectedRef.current = selectedSkill;
  }, [selectedSkill]);

  const simNodes = useMemo<SimNode[]>(() => nodes.map((n) => ({ ...n })), [nodes]);
  const simLinks = useMemo<SimLink[]>(() => links.map((l) => ({ ...l })), [links]);
  const adjacency = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const l of links) {
      if (!m.has(l.source)) m.set(l.source, new Set());
      if (!m.has(l.target)) m.set(l.target, new Set());
      m.get(l.source)!.add(l.target);
      m.get(l.target)!.add(l.source);
    }
    return m;
  }, [links]);

  // Keep canvas sized to its container.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.max(280, Math.floor(entry.contentRect.width));
      setSize({ w, h: w < 520 ? 420 : 480 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Physics + drawing.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(52)
          .strength(0.5),
      )
      .force("charge", forceManyBody().strength(-120))
      .force("center", forceCenter(size.w / 2, size.h / 2))
      .force("x", forceX(size.w / 2).strength(0.05))
      .force("y", forceY(size.h / 2).strength(0.06))
      .force("collide", forceCollide<SimNode>().radius((d) => RADIUS[d.type] + 6));
    simRef.current = sim;

    if (reduce) {
      sim.stop();
      for (let i = 0; i < 300; i++) sim.tick();
    }

    const draw = () => {
      const c = colorsRef.current;
      const sel = selectedRef.current ? `skill:${selectedRef.current}` : null;
      const hover = hoverRef.current;
      const focus = hover ?? sel;
      const near = focus ? adjacency.get(focus) : null;
      ctx.clearRect(0, 0, size.w, size.h);

      ctx.lineWidth = 1;
      for (const l of simLinks) {
        const s = l.source as SimNode;
        const t = l.target as SimNode;
        const lit = focus && (s.id === focus || t.id === focus);
        ctx.strokeStyle = lit ? c.accent : c.line;
        ctx.globalAlpha = focus ? (lit ? 0.9 : 0.25) : 0.7;
        ctx.beginPath();
        ctx.moveTo(s.x ?? 0, s.y ?? 0);
        ctx.lineTo(t.x ?? 0, t.y ?? 0);
        ctx.stroke();
      }

      ctx.font = "11px var(--font-sans), system-ui, sans-serif";
      ctx.textAlign = "center";
      for (const n of simNodes) {
        const isFocus = n.id === focus;
        const isNear = near?.has(n.id) ?? false;
        const dim = focus !== null && !isFocus && !isNear;
        ctx.globalAlpha = dim ? 0.25 : 1;
        const x = n.x ?? 0;
        const y = n.y ?? 0;
        const r = RADIUS[n.type] + (isFocus ? 2 : 0);

        if (n.type === "skill") {
          ctx.fillStyle = categoryColor(c, n.category);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (n.type === "project") {
          ctx.fillStyle = c.accent;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (n.type === "org") {
          ctx.fillStyle = c.fg;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        } else {
          ctx.fillStyle = c.bg;
          ctx.strokeStyle = c.fg;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x, y - r - 1);
          ctx.lineTo(x + r + 1, y);
          ctx.lineTo(x, y + r + 1);
          ctx.lineTo(x - r - 1, y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.lineWidth = 1;
        }

        // Label focus, neighbours and the structural nodes; skip labels for idle skills.
        if (isFocus || isNear || n.type !== "skill") {
          ctx.fillStyle = c.fg;
          ctx.fillText(n.label, x, y - r - 5);
        }
      }
      ctx.globalAlpha = 1;
    };

    sim.on("tick", draw);
    draw();
    return () => {
      sim.stop();
      simRef.current = null;
    };
  }, [simNodes, simLinks, size, adjacency]);

  // Redraw when selection or theme changes while the sim is idle.
  useEffect(() => {
    simRef.current?.alpha(0.02).restart();
  }, [selectedSkill, colors]);

  function pick(ev: React.MouseEvent<HTMLCanvasElement>) {
    const rect = ev.currentTarget.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    let best: SimNode | null = null;
    let bestD = Infinity;
    for (const n of simNodes) {
      const d = Math.hypot((n.x ?? 0) - x, (n.y ?? 0) - y);
      if (d < RADIUS[n.type] + 8 && d < bestD) {
        best = n;
        bestD = d;
      }
    }
    return best;
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        style={{ width: size.w, height: size.h, touchAction: "manipulation" }}
        className="block cursor-pointer rounded-2xl"
        role="img"
        aria-label="Knowledge graph connecting projects, skills, papers and employers. Use the skill filter and project list for the same information."
        onPointerMove={(e) => {
          const n = pick(e);
          const id = n?.id ?? null;
          if (hoverRef.current !== id) {
            hoverRef.current = id;
            setHoverLabel(n ? n.label : null);
            simRef.current?.alpha(0.02).restart();
          }
        }}
        onPointerLeave={() => {
          hoverRef.current = null;
          setHoverLabel(null);
          simRef.current?.alpha(0.02).restart();
        }}
        onClick={(e) => {
          const n = pick(e);
          if (!n) return;
          if (n.type === "skill") {
            const id = n.id.replace("skill:", "");
            onSelectSkill(selectedSkill === id ? null : id);
          } else if (n.type === "project" && n.slug) {
            onOpenProject(n.slug);
          }
        }}
      />
      <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
        <span>● project</span>
        <span>■ employer</span>
        <span>◆ paper</span>
        <span>● skill</span>
        {hoverLabel && <span className="text-fg">{hoverLabel}</span>}
      </div>
    </div>
  );
}
