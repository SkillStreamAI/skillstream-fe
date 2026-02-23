'use client';
import { useState, useEffect } from 'react';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { EpisodeList } from '@/components/player/EpisodeList';
import { getEpisodes } from '@/lib/lambda';
import type { Episode } from '@/lib/types';

const MOCK_EPISODES: Episode[] = [
  {
    id: 'ep1',
    title: 'Introduction to Cloud Architecture',
    topic: 'AWS',
    level: 'foundational',
    durationMin: 18,
    audioUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ep2',
    title: 'Serverless Patterns with AWS Lambda',
    topic: 'AWS',
    level: 'intermediate',
    durationMin: 25,
    audioUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ep3',
    title: 'Amazon Bedrock & Foundation Models',
    topic: 'AI Engineering',
    level: 'intermediate',
    durationMin: 30,
    audioUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ep4',
    title: 'React Performance Deep Dive',
    topic: 'React',
    level: 'advanced',
    durationMin: 32,
    audioUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ep5',
    title: 'TypeScript Advanced Types & Patterns',
    topic: 'TypeScript',
    level: 'advanced',
    durationMin: 28,
    audioUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ep6',
    title: 'Kubernetes Production Architecture',
    topic: 'DevOps',
    level: 'expert',
    durationMin: 45,
    audioUrl: '',
    createdAt: new Date().toISOString(),
  },
];

export default function PlayerPage() {
  const [episodes, setEpisodes]   = useState<Episode[]>([]);
  const [current, setCurrent]     = useState<Episode | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getEpisodes()
      .then((data) => setEpisodes(data.episodes))
      .catch(() => {
        // Lambda not configured — use mock data
        setEpisodes(MOCK_EPISODES);
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-advance to next episode when current ends
  const handleEnded = () => {
    if (!current) return;
    const idx = episodes.findIndex((e) => e.id === current.id);
    if (idx >= 0 && idx < episodes.length - 1) {
      setCurrent(episodes[idx + 1]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Podcast <span className="gradient-text">Player</span>
        </h1>
        <p className="mt-2 text-[#a1a1aa]">
          Listen to AI-generated episodes — each one a focused 5–10 minute concept deep-dive.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div
            className="h-8 w-8 rounded-full border-4 border-[#2a2a2a] border-t-[#7c3aed]"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
        </div>
      )}

      {!loading && (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Episode list */}
          <div className="gradient-border rounded-xl">
            <div className="flex h-[calc(100vh-240px)] min-h-[400px] flex-col rounded-xl bg-[#111]">
              <div className="border-b border-[#2a2a2a] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#52525b]">
                  Episodes ({episodes.length})
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <EpisodeList
                  episodes={episodes}
                  currentId={current?.id ?? null}
                  onSelect={setCurrent}
                />
              </div>
            </div>
          </div>

          {/* Audio player */}
          <div className="gradient-border rounded-xl">
            <div className="rounded-xl bg-[#111] p-8">
              <AudioPlayer episode={current} onEnded={handleEnded} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
