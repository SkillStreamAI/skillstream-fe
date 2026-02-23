'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContent } from '@/lib/lambda';
import type { ContentRoadmap } from '@/lib/types';

function RoadmapCard({ roadmap }: Readonly<{ roadmap: ContentRoadmap }>) {
  const readyCount    = roadmap.episodes.filter((e) => e.status === 'READY').length;
  const pendingCount  = roadmap.episodes.length - readyCount;

  return (
    <div className="gradient-border rounded-xl">
      <div className="flex h-full flex-col rounded-xl bg-[#111] p-6 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed]">
            {roadmap.topic}
          </p>
          <h2 className="mt-1 text-lg font-bold text-white leading-snug">
            {roadmap.title}
          </h2>
          <p className="mt-2 text-sm text-[#a1a1aa] leading-relaxed line-clamp-3">
            {roadmap.description}
          </p>
        </div>

        {/* Episode stats */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-[#a1a1aa]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#52525b]" />
            {roadmap.episodes.length} episodes
          </span>
          {readyCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-teal-800/40 bg-teal-950/40 px-3 py-1 text-teal-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              {readyCount} ready
            </span>
          )}
          {pendingCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-yellow-800/40 bg-yellow-950/40 px-3 py-1 text-yellow-500">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
              {pendingCount} pending
            </span>
          )}
        </div>

        {/* Episode list preview */}
        <div className="flex flex-col gap-1.5 flex-1">
          {roadmap.episodes.map((ep) => (
            <div
              key={ep.id}
              className="flex items-start gap-2 rounded-lg bg-[#1a1a1a] px-3 py-2"
            >
              <span className="mt-0.5 shrink-0 text-xs">
                {ep.status === 'READY' ? '🎙️' : '⏳'}
              </span>
              <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-2">
                {ep.title}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/player"
          className="mt-auto inline-flex items-center justify-center rounded-xl
            bg-[linear-gradient(135deg,#7c3aed,#2563eb)] px-4 py-2.5 text-sm
            font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Open in Player
        </Link>
      </div>
    </div>
  );
}

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<ContentRoadmap[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    getContent()
      .then(setRoadmaps)
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('getContent failed:', msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Learning <span className="gradient-text">Roadmaps</span>
        </h1>
        <p className="mt-2 text-[#a1a1aa]">
          AI-generated roadmaps with structured episodes — work through them in order.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-950/40 px-4 py-3 text-sm text-red-400 border border-red-900/40">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-20">
          <div
            className="h-8 w-8 rounded-full border-4 border-[#2a2a2a] border-t-[#7c3aed]"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
        </div>
      )}

      {!loading && !error && roadmaps.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="text-4xl">📭</div>
          <p className="text-[#a1a1aa]">No roadmaps yet.</p>
          <Link
            href="/generator"
            className="text-sm font-medium text-[#7c3aed] hover:text-[#2563eb] transition-colors"
          >
            Generate your first roadmap →
          </Link>
        </div>
      )}

      {!loading && roadmaps.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((rm) => (
            <RoadmapCard key={rm.id} roadmap={rm} />
          ))}
        </div>
      )}
    </div>
  );
}
