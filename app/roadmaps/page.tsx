'use client';

import { useState, useEffect } from 'react';
import { getContent } from '@/lib/lambda';
import type { ContentRoadmap } from '@/lib/types';
import { GlassRoadmapPanel } from '@/components/roadmap/GlassRoadmapPanel';

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
    <div>
      {/* ── Hero header ── */}
      <div className="hero-gradient border-b border-[#2c2828] px-4 pt-20 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8a020]">
            Library
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-1)] sm:text-4xl">
            Learning Roadmaps
          </h1>
          <p className="mt-3 text-sm text-[var(--text-2)] sm:text-base">
            AI-generated roadmaps with structured episodes — tap a roadmap to explore its episodes.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

        {error && (
          <div className="mb-6 rounded-2xl border border-red-900/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-24">
            <div
              className="h-8 w-8 rounded-full border-4 border-[var(--border)] border-t-[var(--amber)]"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
          </div>
        )}

        {!loading && !error && roadmaps.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <div className="text-4xl" aria-hidden="true">📭</div>
            <p className="text-[var(--text-2)]">No roadmaps yet.</p>
            <p className="text-sm text-[var(--text-3)]">
              Check back soon — roadmaps are generated automatically.
            </p>
          </div>
        )}

        {!loading && roadmaps.length > 0 && (
          <div className="flex flex-col gap-4 md:gap-5">
            {roadmaps.map((rm, i) => (
              <GlassRoadmapPanel key={rm.id} roadmap={rm} defaultOpen={i === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
