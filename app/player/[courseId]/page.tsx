'use client';
import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getContent } from '@/lib/lambda';
import { usePlayerStore } from '@/lib/player-store';
import { CoursePlayer } from '@/components/player/CoursePlayer';
import { EpisodeList } from '@/components/player/EpisodeList';
import type { ContentRoadmap, Episode } from '@/lib/types';
import type { CourseGroup } from '@/components/player/EpisodeList';

function proxyAudioUrl(s3Url: string | null): string {
  if (!s3Url) return '';
  const sanitized = s3Url.replaceAll(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  return `/api/audio?url=${encodeURIComponent(sanitized)}`;
}

function extractCourse(
  roadmaps: ContentRoadmap[],
  courseId: string,
): { episodes: Episode[]; topic: string; title: string } | null {
  const rm = roadmaps.find((r) => r.id === courseId);
  if (!rm) return null;
  const episodes: Episode[] = rm.episodes
    .filter((ep) => ep.audio_url && (ep.status === 'COMPLETED' || ep.status === 'READY'))
    .map((ep) => ({
      id: ep.id,
      title: ep.title,
      topic: rm.topic,
      level: '',
      durationMin: 0,
      audioUrl: proxyAudioUrl(ep.audio_url),
      createdAt: '',
      overview: ep.overview,
      status: ep.status,
    }));
  return { episodes, topic: rm.topic, title: rm.title };
}

export default function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoplay = searchParams.get('autoplay') === 'true';

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentTrackId, setQueue, playTrack } = usePlayerStore();

  useEffect(() => {
    getContent()
      .then((roadmaps) => {
        const course = extractCourse(roadmaps, courseId);
        if (!course) { router.replace('/player'); return; }
        setEpisodes(course.episodes);
        setTopic(course.topic);
        setTitle(course.title);
        setQueue(course.episodes);
        const inCourse = course.episodes.some((e) => e.id === currentTrackId);
        if (shouldAutoplay && !inCourse && course.episodes.length > 0) {
          playTrack(course.episodes[0].id);
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [courseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Build the single-course group for EpisodeList
  const courseGroup: CourseGroup[] = episodes.length > 0
    ? [{ id: courseId, title, topic, episodes }]
    : [];

  return (
    <div>
      {/* Header */}
      <div className="hero-gradient border-b border-[var(--border)] px-4 pt-20 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-3 flex items-center gap-2 text-xs text-[var(--text-3)]">
            <a href="/player" className="transition-colors hover:text-[var(--text-2)]">Player</a>
            <span>/</span>
            <span className="text-[var(--text-2)]">{topic || '…'}</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--amber)]">{topic}</p>
          <h1 className="text-2xl font-bold text-[var(--text-1)] sm:text-3xl line-clamp-2">{title || 'Loading…'}</h1>
          {episodes.length > 0 && (
            <p className="mt-2 text-sm text-[var(--text-3)]">
              {episodes.length} episode{episodes.length === 1 ? '' : 's'}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {error && (
          <div className="mb-6 rounded-2xl border border-red-900/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 rounded-full border-4 border-[var(--border)] border-t-[var(--amber)]"
              style={{ animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}

        {!loading && episodes.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">

            {/* ── NyxUI-style player (left / top) ─── */}
            <div className="order-1 lg:sticky lg:top-24">
              <CoursePlayer
                courseTopic={topic}
                courseTitle={title}
                episodes={episodes}
              />
            </div>

            {/* ── Episode list (right / below) ─────── */}
            <div className="order-2">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-3)]">
                  Episodes
                </p>
                <p className="text-xs text-[var(--text-3)]">
                  {episodes.length} total
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-1">
                <EpisodeList
                  courses={courseGroup}
                  currentId={currentTrackId}
                  onSelect={(ep) => playTrack(ep.id)}
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
