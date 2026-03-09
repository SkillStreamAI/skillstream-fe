'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContent } from '@/lib/lambda';
import type { ContentRoadmap } from '@/lib/types';

/* ── 3D perspective grid background ───────────────────────── */
function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Perspective grid floor */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(44,40,40,0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(44,40,40,0.7) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          transform: 'perspective(700px) rotateX(60deg) scaleX(1.4) translateY(-15%)',
          transformOrigin: '50% 0%',
          opacity: 0.55,
        }}
      />
      {/* Horizon amber glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 35% at 50% 100%, rgba(232,160,32,0.10) 0%, transparent 70%)',
        }}
      />
      {/* Top fade so it blends into the page bg */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, #0d0c0c 0%, transparent 35%, transparent 65%, #0d0c0c 100%)',
        }}
      />
    </div>
  );
}

/* ── Roadmap card ──────────────────────────────────────────── */
function RoadmapCard({ roadmap }: Readonly<{ roadmap: ContentRoadmap }>) {
  const readyCount   = roadmap.episodes.filter((e) => e.status === 'READY' || e.status === 'COMPLETED').length;
  const pendingCount = roadmap.episodes.length - readyCount;

  return (
    <div className="card-fade-in gradient-border rounded-2xl group">
      <div className="flex h-full flex-col rounded-2xl bg-[#161414] p-6 gap-4 transition-colors hover:bg-[#1a1818]">

        {/* Topic + title */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8a020]/25 bg-[#e8a020]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#e8a020]">
            <span className="h-1 w-1 rounded-full bg-[#e8a020]" />
            {roadmap.topic}
          </span>
          <h2 className="mt-2 text-base font-bold text-[#f5f0eb] leading-snug">
            {roadmap.title}
          </h2>
          <p className="mt-1.5 text-sm text-[#9e9792] leading-relaxed line-clamp-2">
            {roadmap.description}
          </p>
        </div>

        {/* Episode stats */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-full border border-[#2c2828] bg-[#1e1c1c] px-3 py-1 text-[#9e9792]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5a5450]" />
            {roadmap.episodes.length} episodes
          </span>
          {readyCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-800/40 bg-emerald-950/30 px-3 py-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {readyCount} ready
            </span>
          )}
          {pendingCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-yellow-800/40 bg-yellow-950/30 px-3 py-1 text-yellow-500">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
              {pendingCount} pending
            </span>
          )}
        </div>

        {/* Episode preview list */}
        <div className="flex flex-col gap-1 flex-1">
          {roadmap.episodes.map((ep) => (
            <div
              key={ep.id}
              className="flex items-start gap-2.5 rounded-xl bg-[#1e1c1c] px-3 py-2 border border-[#2c2828]/50"
            >
              <span className="mt-0.5 shrink-0 text-xs">
                {ep.status === 'READY' || ep.status === 'COMPLETED' ? '🎙️' : '⏳'}
              </span>
              <p className="text-xs text-[#9e9792] leading-relaxed line-clamp-1">{ep.title}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/player"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl
            bg-[#e8a020] px-4 py-2.5 text-sm font-semibold text-black
            transition-colors hover:bg-[#f5b030] active:scale-[0.98]"
        >
          Open in Player
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
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
      {/* ── Hero header with 3D grid ─── */}
      <div className="relative overflow-hidden border-b border-[#2c2828] px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <GridBackground />
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8a020]">
            Library
          </p>
          <h1 className="text-3xl font-bold text-[#f5f0eb] sm:text-4xl">
            Learning Roadmaps
          </h1>
          <p className="mt-3 max-w-lg text-sm text-[#9e9792] sm:text-base">
            AI-generated roadmaps with structured episodes — work through them in order.
          </p>
        </div>
      </div>

      {/* ── Content ─────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {error && (
          <div className="mb-6 rounded-2xl border border-red-900/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-24">
            <div
              className="h-8 w-8 rounded-full border-4 border-[#2c2828] border-t-[#e8a020]"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
          </div>
        )}

        {!loading && !error && roadmaps.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <div className="text-4xl">📭</div>
            <p className="text-[#9e9792]">No roadmaps yet.</p>
            <p className="text-sm text-[#5a5450]">Check back soon — roadmaps are generated automatically.</p>
          </div>
        )}

        {!loading && roadmaps.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((rm, i) => (
              <div key={rm.id} style={{ animationDelay: `${i * 60}ms` }}>
                <RoadmapCard roadmap={rm} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
