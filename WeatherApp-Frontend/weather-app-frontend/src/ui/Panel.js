import React from "react";

/**
 * Side card. Shell: rounded-card (20) + p-card-inset (8) -> rows use rounded-item (12).
 */
const Panel = ({ title, meta, children, ...props }) => (
  <section className="rounded-card border border-line bg-surface p-card-inset" {...props}>
    <div className="flex items-baseline justify-between px-3 pb-2 pt-2.5">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {meta && (
        <span className="font-mono text-xs tabular-nums text-ink-subtle">{meta}</span>
      )}
    </div>
    {children}
  </section>
);

export const SkeletonRows = ({ rows = 3 }) => (
  <div className="space-y-1" aria-hidden="true">
    {Array.from({ length: rows }, (_, i) => (
      <div
        key={i}
        className="h-11 animate-pulse rounded-item bg-canvas"
        style={{ animationDelay: `${i * 120}ms` }}
      />
    ))}
  </div>
);

export default Panel;
