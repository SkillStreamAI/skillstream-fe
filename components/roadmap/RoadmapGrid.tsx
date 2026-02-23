import type { RoadmapNode, Level } from '@/lib/types';
import { RoadmapCard } from './RoadmapCard';

const LEVEL_ORDER: Level[] = ['foundational', 'intermediate', 'advanced', 'expert'];

const LEVEL_LABELS: Record<Level, string> = {
  foundational: 'Foundational',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
  expert:       'Expert',
};

interface RoadmapGridProps {
  nodes: RoadmapNode[];
}

export function RoadmapGrid({ nodes }: RoadmapGridProps) {
  const grouped = LEVEL_ORDER.reduce<Record<Level, RoadmapNode[]>>(
    (acc, level) => {
      acc[level] = nodes.filter((n) => n.level === level);
      return acc;
    },
    { foundational: [], intermediate: [], advanced: [], expert: [] }
  );

  return (
    <div className="flex flex-col gap-10">
      {LEVEL_ORDER.map((level) => {
        const group = grouped[level];
        if (group.length === 0) return null;
        return (
          <section key={level}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">
                {LEVEL_LABELS[level]}
              </h2>
              <span className="text-xs text-[#52525b] bg-[#1a1a1a] px-2 py-0.5 rounded-full border border-[#2a2a2a]">
                {group.length} {group.length === 1 ? 'module' : 'modules'}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((node) => (
                <RoadmapCard key={node.id} node={node} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
