import type { SortAlgorithm } from '../algorithms/types';

interface Props {
  algorithm: SortAlgorithm;
}

function Badge({ label, value, tone, tooltip }: { label: string; value: string; tone: string; tooltip: string }) {
  return (
    <div className="group relative">
      <div className={`flex w-24 flex-col rounded-xl px-3 py-2 ring-1 ${tone}`}>
        <span className="text-[10px] uppercase tracking-wide opacity-70">{label}</span>
        <span className="truncate font-mono text-sm font-semibold">{value}</span>
      </div>
      <div role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-pond-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-pond-800">
        {tooltip}
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-pond-900 dark:border-t-pond-800" />
      </div>
    </div>
  );
}

export function ComplexityBadges({ algorithm }: Props) {
  const t = algorithm.complexity.time;
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        label="Best"
        value={t.best}
        tone="bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:ring-emerald-700/40"
        tooltip={`Best-case time complexity: how fast this algorithm runs on the most favorable input (e.g. already sorted). ${t.best}`}
      />
      <Badge
        label="Average"
        value={t.average}
        tone="bg-sky-50 text-sky-900 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-100 dark:ring-sky-700/40"
        tooltip={`Average-case time complexity: expected performance on a typical random input. ${t.average}`}
      />
      <Badge
        label="Worst"
        value={t.worst}
        tone="bg-rose-50 text-rose-900 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-100 dark:ring-rose-700/40"
        tooltip={`Worst-case time complexity: slowest possible performance, often on reverse-sorted input. ${t.worst}`}
      />
      <Badge
        label="Space"
        value={algorithm.complexity.space}
        tone="bg-violet-50 text-violet-900 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-100 dark:ring-violet-700/40"
        tooltip={`Space complexity: how much extra memory the algorithm needs beyond the input array. ${algorithm.complexity.space}`}
      />
      <div className="flex items-center gap-1 self-end">
        <Chip ok={algorithm.stable} tooltip="Stable sort: equal elements keep their original relative order. Important when sorting objects by multiple keys.">Stable</Chip>
        <Chip ok={algorithm.inPlace} tooltip="In-place sort: sorts directly in the input array using only O(1) extra memory — no large auxiliary arrays needed.">In-place</Chip>
      </div>
    </div>
  );
}

function Chip({ ok, children, tooltip }: { ok: boolean; children: React.ReactNode; tooltip: string }) {
  return (
    <div className="group relative">
      <span
        className={`inline-block cursor-default rounded-full px-2 py-1 text-[11px] font-medium ring-1 ${
          ok
            ? 'bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-100 dark:ring-emerald-700/40'
            : 'bg-pond-100 text-pond-700 ring-pond-200 dark:bg-pond-800/50 dark:text-pond-200 dark:ring-pond-700/40'
        }`}
      >
        {ok ? '✓' : '✗'} {children}
      </span>
      <div role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-lg bg-pond-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-pond-800">
        {tooltip}
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-pond-900 dark:border-t-pond-800" />
      </div>
    </div>
  );
}
