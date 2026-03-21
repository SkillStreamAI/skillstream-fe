import type { Level } from '@/lib/types';

const LEVEL_CONFIG: Record<Level, { label: string; className: string }> = {
  foundational: {
    label: 'Foundational',
    className: 'bg-teal-500 text-white',
  },
  intermediate: {
    label: 'Intermediate',
    className: 'bg-blue-500 text-white',
  },
  advanced: {
    label: 'Advanced',
    className: 'bg-purple-500 text-white',
  },
  expert: {
    label: 'Expert',
    className: 'bg-rose-500 text-white',
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
