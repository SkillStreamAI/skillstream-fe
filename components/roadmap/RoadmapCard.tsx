'use client';
import { useRouter } from 'next/navigation';
import type { RoadmapNode } from '@/lib/types';
import ThreeDLayeredCard from '@/components/ui/3d-layered-card';

const LEVEL_BG: Record<string, string> = {
  foundational: 'bg-gradient-to-b from-[#14532d] via-[#15803d] to-[#0a2e1a]',
  intermediate:  'bg-gradient-to-b from-[#1e3a8a] via-[#1d4ed8] to-[#0f172a]',
  advanced:      'bg-gradient-to-b from-[#5b21b6] via-[#7c3aed] to-[#1e0a3c]',
  expert:        'bg-gradient-to-b from-[#9f1239] via-[#be123c] to-[#310713]',
};

const LEVEL_GLOW: Record<string, { color: string; gradient: string }> = {
  foundational: { color: 'rgba(74,222,128,0.18)',  gradient: '#4ade80' },
  intermediate: { color: 'rgba(99,102,241,0.18)',  gradient: '#6366f1' },
  advanced:     { color: 'rgba(168,85,247,0.18)',  gradient: '#a855f7' },
  expert:       { color: 'rgba(251,113,133,0.18)', gradient: '#fb7185' },
};

const LEVEL_LABELS: Record<string, string> = {
  foundational: 'Foundational',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
  expert:       'Expert',
};

interface RoadmapCardProps {
  node: RoadmapNode;
}

export function RoadmapCard({ node }: Readonly<RoadmapCardProps>) {
  const router = useRouter();
  const glow   = LEVEL_GLOW[node.level] ?? LEVEL_GLOW.foundational;
  const bg     = LEVEL_BG[node.level]   ?? LEVEL_BG.foundational;

  return (
    <ThreeDLayeredCard
      logo="/ss-logo.svg"
      mainImage="/img-wave.svg"
      title={node.title}
      width="100%"
      height={{ collapsed: 160, expanded: 320 }}
      logoSize={52}
      logoPosition={{ expanded: 12 }}
      titlePosition={108}
      backgroundColor={bg}
      glowColor={glow.color}
      glowGradient={glow.gradient}
      shineIntensity={0.25}
      textColor="white"
    >
      <div className="flex flex-col items-center gap-2 w-full px-2">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80">
            {LEVEL_LABELS[node.level] ?? node.level}
          </span>
          <span className="text-[10px] text-white/50">{node.durationMin} min</span>
        </div>
        <p className="text-[11px] text-white/70 text-center leading-relaxed line-clamp-2">
          {node.description}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/player?episode=${encodeURIComponent(node.id)}`);
          }}
          disabled={!node.audioUrl}
          className="mt-1 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-40 px-4 py-1 text-xs font-semibold text-white transition-colors"
        >
          {node.audioUrl ? (
            <><span aria-hidden="true">▶</span> Play</>
          ) : 'Coming Soon'}
        </button>
      </div>
    </ThreeDLayeredCard>
  );
}
