"use client";

import { useState } from "react";

/** Shows /photo.jpg if it exists, otherwise a placeholder with initials. */
export function Portrait() {
  const [missing, setMissing] = useState(false);
  return (
    <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-line bg-bg-elev">
      {!missing && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/photo.jpg"
          alt="Portrait of Charith Rage"
          className="h-full w-full object-cover"
          onError={() => setMissing(true)}
        />
      )}
      {missing && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted">
          <span className="font-display text-6xl text-fg/80">CR</span>
          <span className="eyebrow">photo placeholder</span>
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-fg/5"
      />
    </div>
  );
}
