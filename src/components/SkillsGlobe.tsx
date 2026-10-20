"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { categoryColor, useThemeColors } from "@/lib/useThemeColors";
import type { SkillCategory } from "@/lib/types";

export interface GlobeSkill {
  id: string;
  label: string;
  category: SkillCategory;
  count: number;
}

/** Evenly spread points on a sphere (Fibonacci lattice). */
function spherePoints(n: number, radius: number): [number, number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return [Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius];
  });
}

function Cloud({
  skills,
  selected,
  onSelect,
  spin,
}: {
  skills: GlobeSkill[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  spin: boolean;
}) {
  const colors = useThemeColors();
  const group = useRef<Group>(null);
  const points = useMemo(() => spherePoints(skills.length, 2.2), [skills.length]);

  useFrame((_, dt) => {
    if (spin && group.current) group.current.rotation.y += dt * 0.12;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[2.2, 24, 16]} />
        <meshBasicMaterial color={colors.line} wireframe transparent opacity={0.55} />
      </mesh>
      {skills.map((s, i) => {
        const active = selected === s.id;
        const dim = selected !== null && !active;
        const color = categoryColor(colors, s.category);
        return (
          <group key={s.id} position={points[i]}>
            <mesh>
              <sphereGeometry args={[0.04 + Math.min(s.count, 4) * 0.012, 12, 12]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <Html center distanceFactor={7} zIndexRange={[10, 0]}>
              <button
                type="button"
                onClick={() => onSelect(active ? null : s.id)}
                aria-pressed={active}
                style={{
                  color: active ? "var(--bg)" : color,
                  background: active ? color : "transparent",
                  borderColor: color,
                  opacity: dim ? 0.25 : 1,
                }}
                className="whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium transition-all"
              >
                {s.label}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function SkillsGlobe({
  skills,
  selected,
  onSelect,
}: {
  skills: GlobeSkill[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
      <Cloud skills={skills} selected={selected} onSelect={onSelect} spin={!reduce && selected === null} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} />
    </Canvas>
  );
}
