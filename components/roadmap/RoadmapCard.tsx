'use client';
import { useRouter } from 'next/navigation';
import type { RoadmapNode } from '@/lib/types';
import { LevelBadge } from './LevelBadge';
import { Button } from '@/components/ui/Button';

interface RoadmapCardProps {
  node: RoadmapNode;
}

export function RoadmapCard({ node }: RoadmapCardProps) {
  const router = useRouter();

  const handlePlay = () => {
    router.push(`/player?episode=${encodeURIComponent(node.id)}`);
  };

  return (
    <div className="gradient-border rounded-xl h-full">
      <div className="flex h-full flex-col rounded-xl bg-[#111] p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <LevelBadge level={node.level} />
          <span className="shrink-0 text-xs text-[#52525b]">
            {node.durationMin} min
          </span>
        </div>

        <h3 className="text-base font-semibold text-white leading-snug">
          {node.title}
        </h3>

        <p className="flex-1 text-sm text-[#a1a1aa] leading-relaxed">
          {node.description}
        </p>

        <Button
          size="sm"
          variant={node.audioUrl ? 'gradient' : 'outline'}
          disabled={!node.audioUrl}
          onClick={handlePlay}
          className="w-full mt-auto"
        >
          {node.audioUrl ? '▶ Play Episode' : 'Coming Soon'}
        </Button>
      </div>
    </div>
  );
}
