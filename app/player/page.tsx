'use client';
import { useState, useEffect } from 'react';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { EpisodeList } from '@/components/player/EpisodeList';
import type { CourseGroup } from '@/components/player/EpisodeList';
import { getContent } from '@/lib/lambda';
import type { ContentRoadmap, Episode } from '@/lib/types';

function proxyAudioUrl(s3Url: string | null): string {
  if (!s3Url) return '';
  const sanitized = s3Url.replaceAll(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  return `/api/audio?url=${encodeURIComponent(sanitized)}`;
}

function groupByCourse(roadmaps: ContentRoadmap[]): { courses: CourseGroup[]; allEpisodes: Episode[] } {
  const courses: CourseGroup[] = [];
  const allEpisodes: Episode[] = [];

  for (const rm of roadmaps) {
    const episodes: Episode[] = [];
    for (const ep of rm.episodes) {
      if (!ep.audio_url || (ep.status !== 'COMPLETED' && ep.status !== 'READY')) continue;
      const mapped: Episode = {
        id: ep.id,
        title: ep.title,
        topic: rm.topic,
        level: '',
        durationMin: 0,
        audioUrl: proxyAudioUrl(ep.audio_url),
        createdAt: '',
        overview: ep.overview,
        status: ep.status,
      };
      episodes.push(mapped);
      allEpisodes.push(mapped);
    }
    if (episodes.length > 0) {
      courses.push({ id: rm.id, title: rm.title, topic: rm.topic, episodes });
    }
  }

  return { courses, allEpisodes };
}

export default function PlayerPage() {
  const [courses, setCourses]     = useState<CourseGroup[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [current, setCurrent]     = useState<Episode | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    getContent()
      .then((roadmaps) => {
        const { courses: c, allEpisodes: all } = groupByCourse(roadmaps);
        setCourses(c);
        setAllEpisodes(all);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('getContent failed:', msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEnded = () => {
    if (!current) return;
    const idx = allEpisodes.findIndex((e) => e.id === current.id);
    if (idx >= 0 && idx < allEpisodes.length - 1) setCurrent(allEpisodes[idx + 1]);
  };

  return (
    <div>
      {/* ── 3D grid page header ─── */}
      <div className="relative overflow-hidden border-b border-[#2c2828] px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        {/* Perspective grid */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(44,40,40,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(44,40,40,0.7) 1px,transparent 1px)', backgroundSize:'48px 48px', transform:'perspective(700px) rotateX(60deg) scaleX(1.4) translateY(-15%)', transformOrigin:'50% 0%', opacity:0.55 }} />
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 35% at 50% 100%,rgba(232,160,32,0.10) 0%,transparent 70%)' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,#0d0c0c 0%,transparent 35%,transparent 65%,#0d0c0c 100%)' }} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#e8a020]">Player</p>
          <h1 className="text-3xl font-bold text-[#f5f0eb] sm:text-4xl">Podcast Player</h1>
          <p className="mt-3 max-w-lg text-sm text-[#9e9792] sm:text-base">
            AI-generated audio episodes — each a focused deep-dive on one concept.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-900/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-24">
          <div
            className="h-8 w-8 rounded-full border-4 border-[#2c2828] border-t-[#e8a020]"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
        </div>
      )}

      {!loading && (
        <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:items-start">

          {/* ── Course list (left / top on mobile) ─────────── */}
          <div className="order-2 lg:order-1">
            {/* Section label */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#5a5450]">
                {courses.length} Course{courses.length === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-[#5a5450]">
                {allEpisodes.length} episode{allEpisodes.length === 1 ? '' : 's'} total
              </p>
            </div>

            {/* Stacked course cards — each is its own card */}
            <div className="flex flex-col gap-3 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-1">
              <EpisodeList
                courses={courses}
                currentId={current?.id ?? null}
                onSelect={setCurrent}
              />
            </div>
          </div>

          {/* ── Audio player (right / top on mobile) ───────── */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="gradient-border-animated glow-active rounded-2xl">
              <div className="rounded-2xl bg-[#161414] p-5 sm:p-8">
                <AudioPlayer episode={current} onEnded={handleEnded} />
              </div>
            </div>
          </div>

        </div>
      )}
      </div>{/* /inner content wrapper */}
    </div>
  );
}
