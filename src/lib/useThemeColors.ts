"use client";

import { useSyncExternalStore } from "react";

const VARS = [
  "bg",
  "fg",
  "muted",
  "line",
  "accent",
  "c-agents",
  "c-retrieval",
  "c-vision",
  "c-ml",
  "c-data",
  "c-cloud",
  "c-engineering",
] as const;

export type ThemeColors = Record<(typeof VARS)[number], string>;

const FALLBACK = Object.fromEntries(VARS.map((v) => [v, "#888888"])) as ThemeColors;

function read(): ThemeColors {
  const cs = getComputedStyle(document.documentElement);
  const out = { ...FALLBACK };
  for (const v of VARS) {
    const val = cs.getPropertyValue(`--${v}`).trim();
    if (val) out[v] = val;
  }
  return out;
}

let cache: { theme: string; colors: ThemeColors } | null = null;

function getSnapshot(): ThemeColors {
  const theme = document.documentElement.getAttribute("data-theme") ?? "light";
  if (!cache || cache.theme !== theme) cache = { theme, colors: read() };
  return cache.colors;
}

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** Resolved CSS variable values, refreshed when the theme attribute changes. */
export function useThemeColors(): ThemeColors {
  return useSyncExternalStore(subscribe, getSnapshot, () => FALLBACK);
}

export function categoryColor(colors: ThemeColors, category?: string) {
  const key = `c-${category ?? "engineering"}` as keyof ThemeColors;
  return colors[key] ?? colors.muted;
}
