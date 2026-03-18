'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContent } from '@/lib/lambda';
import type { ContentRoadmap } from '@/lib/types';
import ThreeDLayeredCard from '@/components/ui/3d-layered-card';

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
    <ThreeDLayeredCard
      logo="/ss-logo.svg"
      mainImage="/img-path.svg"
      title={roadmap.title}
      width="100%"
      height={{ collapsed: 160, expanded: 340 }}
      logoSize={52}
      logoPosition={{ expanded: 12 }}
      titlePosition={108}
      backgroundColor="bg-gradient-to-b from-[#3d1a00] via-[#78350f] to-[#1a0a00]"
      glowColor="rgba(232,160,32,0.18)"
      glowGradient="#e8a020"
      shineIntensity={0.25}
      textColor="white"
    >
      <div className="flex flex-col items-center gap-2 w-full px-2">
        <span className="rounded-full border border-[#e8a020]/40 bg-[#e8a020]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#e8a020]">
          {roadmap.topic}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-white/50 flex-wrap justify-center">
          <span>{roadmap.episodes.length} episodes</span>
          {readyCount > 0 && <span className="text-emerald-400">{readyCount} ready</span>}
          {pendingCount > 0 && <span className="text-yellow-400">{pendingCount} pending</span>}
        </div>
        <Link
          href={`/player/${roadmap.id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 rounded-full bg-[#e8a020] hover:bg-[#f5b030] px-4 py-1 text-xs font-semibold text-black transition-colors"
        >
          Open in Player
        </Link>
      </div>
    </ThreeDLayeredCard>
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
            <div className="text-4xl" aria-hidden="true">📭</div>
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
