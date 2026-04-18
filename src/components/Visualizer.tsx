import { useEffect, useRef, useState } from 'react';
import type { HighlightRole } from '../algorithms/types';
import type { RunnerItem } from '../hooks/useSortRunner';
import { DuckColumn } from './DuckColumn';

interface Props {
  items: RunnerItem[];
  highlights: Record<number, HighlightRole>;
  maxValue: number;
}

export function Visualizer({ items, highlights, maxValue }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 480 });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const n = items.length;
  const gap = Math.max(2, Math.min(8, size.w * 0.004));
  const columnWidth = Math.max(10, Math.floor((size.w - gap * (n + 1)) / Math.max(1, n)));
  const heightBudget = size.h - 36;
  const duckHeightAspect = 40 / 64;
  const duckSize = Math.max(
    6,
    Math.min(
      columnWidth - 14,
      Math.floor(heightBudget / (maxValue * duckHeightAspect)),
    ),
  );
  const showLabel = columnWidth >= 22 && n <= 20;

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden rounded-3xl border border-pond-200/60 bg-gradient-to-b from-pond-50/70 to-pond-100/50 shadow-soft dark:border-pond-800/50 dark:from-pond-900/60 dark:to-pond-950/70"
    >
      <div
        className="absolute inset-x-0 bottom-3 top-3 flex items-end justify-center"
        style={{ gap }}
      >
        {items.map((it, index) => (
          <DuckColumn
            key={it.id}
            id={it.id}
            value={it.value}
            duckSize={duckSize}
            columnWidth={columnWidth}
            highlight={highlights[index]}
            showLabel={showLabel}
          />
        ))}
      </div>
      {/* Pond water surface - two layers at different speeds for parallax */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 overflow-hidden" aria-hidden="true">
        <svg className="animate-wave-slow absolute bottom-0 h-5" style={{ width: '200%' }} viewBox="0 0 2400 40" preserveAspectRatio="none">
          <path d="M0,20 C150,8 300,32 450,20 C600,8 750,32 900,20 C1050,8 1150,28 1200,20 C1350,8 1500,32 1650,20 C1800,8 1950,32 2100,20 C2250,8 2350,28 2400,20 L2400,40 L0,40 Z" fill="rgba(125,211,252,0.35)" />
        </svg>
        <svg className="animate-wave-fast absolute bottom-0 h-5" style={{ width: '200%' }} viewBox="0 0 2400 40" preserveAspectRatio="none">
          <path d="M0,28 C200,16 400,36 600,26 C800,16 1000,34 1200,26 C1400,16 1600,36 1800,26 C2000,16 2200,34 2400,26 L2400,40 L0,40 Z" fill="rgba(56,189,248,0.22)" />
        </svg>
      </div>
    </div>
  );
}
