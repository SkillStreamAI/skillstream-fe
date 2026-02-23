'use client';
import type { Episode } from '@/lib/types';

interface EpisodeListProps {
  episodes: Episode[];
  currentId: string | null;
  onSelect: (episode: Episode) => void;
}

export function EpisodeList({ episodes, currentId, onSelect }: EpisodeListProps) {
  if (episodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#52525b]">
        No episodes available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {episodes.map((ep) => (
        <button
          key={ep.id}
          onClick={() => onSelect(ep)}
          className={[
            'w-full rounded-xl px-4 py-3 text-left transition-all cursor-pointer',
            currentId === ep.id
              ? 'bg-[linear-gradient(135deg,#7c3aed22,#2563eb22)] border border-[#7c3aed]/40 text-white'
              : 'border border-transparent text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white',
          ].join(' ')}
        >
          <p className="text-sm font-medium leading-snug line-clamp-2">
            {ep.title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#52525b]">
            <span className="capitalize">{ep.topic}</span>
            <span>·</span>
            <span className="capitalize">{ep.level}</span>
            <span>·</span>
            <span>{ep.durationMin} min</span>
          </div>
        </button>
      ))}
    </div>
  );
}
