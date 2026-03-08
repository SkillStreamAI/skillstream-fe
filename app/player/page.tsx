'use client';
import { useState, useEffect } from 'react';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { EpisodeList } from '@/components/player/EpisodeList';
import type { CourseGroup } from '@/components/player/EpisodeList';
import { getContent } from '@/lib/lambda';
import type { ContentRoadmap, Episode } from '@/lib/types';

function proxyAudioUrl(s3Url: string | null): string {
  if (!s3Url) return '';
  const sanitized = s3Url.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
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
  const [allEpisodes, setAll]     = useState<Episode[]>([]);
  const [current, setCurrent]     = useState<Episode | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    getContent()
      .then((roadmaps) => {
        const { courses: c, allEpisodes: all } = groupByCourse(roadmaps);
        setCourses(c);
        setAll(all);
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
    if (idx >= 0 && idx < allEpisodes.length - 1) {
      setCurrent(allEpisodes[idx + 1]);
    }
  };

  const totalEpisodes = allEpisodes.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Podcast <span className="gradient-text">Player</span>
        </h1>
        <p className="mt-1 text-sm text-[#a1a1aa] sm:mt-2 sm:text-base">
          Listen to AI-generated episodes — each one a focused 5–10 minute concept deep-dive.
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

      {!loading && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[360px_1fr]">
          {/* Audio player */}
          <div className="order-1 lg:order-2 gradient-border rounded-xl">
            <div className="rounded-xl bg-[#111] p-4 sm:p-8">
              <AudioPlayer episode={current} onEnded={handleEnded} />
            </div>
          </div>

          {/* Course / episode list */}
          <div className="order-2 lg:order-1 gradient-border rounded-xl">
            <div className="flex h-[50vh] min-h-[280px] flex-col rounded-xl bg-[#111] lg:h-[calc(100vh-240px)] lg:min-h-[400px]">
              <div className="border-b border-[#2a2a2a] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#52525b]">
                  {courses.length} Course{courses.length === 1 ? '' : 's'} · {totalEpisodes} Episode{totalEpisodes === 1 ? '' : 's'}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <EpisodeList
                  courses={courses}
                  currentId={current?.id ?? null}
                  onSelect={setCurrent}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
