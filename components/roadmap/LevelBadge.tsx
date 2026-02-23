import type { Level } from '@/lib/types';

const LEVEL_CONFIG: Record<Level, { label: string; className: string }> = {
  foundational: {
    label: 'Foundational',
    className: 'bg-teal-950/50 text-teal-400 border border-teal-800/50',
  },
  intermediate: {
    label: 'Intermediate',
    className: 'bg-blue-950/50 text-blue-400 border border-blue-800/50',
  },
  advanced: {
    label: 'Advanced',
    className: 'bg-purple-950/50 text-purple-400 border border-purple-800/50',
  },
  expert: {
    label: 'Expert',
    className: 'bg-rose-950/50 text-rose-400 border border-rose-800/50',
  },
};

export function LevelBadge({ level }: { level: Level }) {
  const { label, className } = LEVEL_CONFIG[level];
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}
