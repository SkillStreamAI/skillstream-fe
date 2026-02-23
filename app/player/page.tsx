'use client';
import { useState, useEffect } from 'react';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { EpisodeList } from '@/components/player/EpisodeList';
import { getContent } from '@/lib/lambda';
import type { ContentRoadmap, Episode } from '@/lib/types';

// Extracted to avoid nesting deeper than 4 levels inside the component
function flattenEpisodes(roadmaps: ContentRoadmap[]): Episode[] {
  const result: Episode[] = [];
  for (const rm of roadmaps) {
    for (const ep of rm.episodes) {
      result.push({
        id: ep.id,
        title: ep.title,
        topic: rm.topic,
        level: '',
        durationMin: 0,
        audioUrl: ep.audio_url ?? '',
        createdAt: '',
        overview: ep.overview,
        status: ep.status,
      });
    }
  }
  return result;
}

export default function PlayerPage() {
  const [episodes, setEpisodes]   = useState<Episode[]>([]);
  const [current, setCurrent]     = useState<Episode | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    getContent()
      .then((roadmaps) => setEpisodes(flattenEpisodes(roadmaps)))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('getContent failed:', msg);
        setError(msg);
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

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-950/40 px-4 py-3 text-sm text-red-400 border border-red-900/40">
          {error}
        </div>
      )}

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
