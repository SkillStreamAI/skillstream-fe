'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { ContentRoadmap, ContentEpisode } from '@/lib/types';

function ChevronIcon({ open }: Readonly<{ open: boolean }>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PlayIcon({ size = 14 }: Readonly<{ size?: number }>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
  const t = useTranslations('roadmaps');
  const isReady = status === 'READY' || status === 'COMPLETED' || status === 'ready';
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        isReady ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-black'
      }`}
    >
      {isReady ? t('statusReady') : t('statusPending')}
    </span>
  );
}

function EpisodeRow({ episode, roadmapId }: Readonly<{ episode: ContentEpisode; roadmapId: string }>) {
  const t = useTranslations('roadmaps');
  return (
    <li className="glass-row group">
      <div className="flex items-start gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
        {/* Status + title block */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={episode.status} />
            <p className="truncate text-sm font-medium text-[var(--text-1)]">{episode.title}</p>
          </div>
          {episode.overview && (
            <p className="line-clamp-1 text-xs leading-relaxed text-[var(--text-2)] transition-all duration-200 group-hover:line-clamp-none">
              {episode.overview}
            </p>
          )}
        </div>

        {/* Play button */}
        <Link
          href={`/player/${roadmapId}?autoplay=true`}
          className="mt-0.5 shrink-0 flex items-center gap-1.5 rounded-full bg-[var(--amber)] px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-[var(--amber)]"
          aria-label={`${t('play')} ${episode.title}`}
        >
          <PlayIcon size={12} />
          <span className="hidden sm:inline">{t('play')}</span>
        </Link>
      </div>
    </li>
  );
}

interface GlassRoadmapPanelProps {
  readonly roadmap: ContentRoadmap;
  readonly defaultOpen?: boolean;
}

export function GlassRoadmapPanel({ roadmap, defaultOpen = false }: GlassRoadmapPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const t = useTranslations('roadmaps');

  const readyCount = roadmap.episodes.filter(
    (e) => e.status === 'READY' || e.status === 'COMPLETED' || e.status === 'ready',
  ).length;
  const pendingCount = roadmap.episodes.length - readyCount;
  const hasPlayable = readyCount > 0;

  return (
    <article className="glass-panel relative overflow-hidden">
      {/* Warm tint overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[1.5rem]"
        style={{ background: 'linear-gradient(135deg, rgba(255,248,240,0.06) 0%, rgba(255,255,255,0.02) 60%, rgba(180,140,255,0.04) 100%)' }}
      />

      {/* ── Panel header ── */}
      <div className="relative z-10 flex w-full items-start gap-3 p-4 sm:items-center sm:p-5">
        {/* Clickable text block */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex min-w-0 flex-1 flex-col gap-1.5 text-left"
          aria-expanded={isOpen}
        >
          {/* Topic pill */}
          <span className="inline-flex w-fit items-center rounded-full border border-[var(--amber)]/30 bg-[var(--amber)]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--amber)]">
            {roadmap.topic}
          </span>

          {/* Title */}
          <h2 className="text-base font-semibold leading-snug text-[var(--text-1)] sm:text-lg">
            {roadmap.title}
          </h2>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--text-2)]">
            <span>{t('episodesCount', { n: roadmap.episodes.length })}</span>
            {readyCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-emerald-500">{readyCount} {t('ready')}</span>
              </>
            )}
            {pendingCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-amber-500">{pendingCount} {t('pending')}</span>
              </>
            )}
          </div>
        </button>

        {/* Right actions: Play All + Chevron */}
        <div className="mt-1 flex shrink-0 items-center gap-2 sm:mt-0">
          {hasPlayable && (
            <Link
              href={`/player/${roadmap.id}?autoplay=true`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-full bg-[var(--amber)] px-3 py-1.5 text-xs font-semibold text-black transition-all hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--amber)]"
              aria-label={`${t('playAll')} — ${roadmap.title}`}
            >
              <PlayIcon size={11} />
              <span>{t('playAll')}</span>
            </Link>
          )}
          <div className="text-[var(--text-2)]">
            <ChevronIcon open={isOpen} />
          </div>
        </div>
      </div>

      {/* ── Accordion episode list ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="episodes"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
            className="relative z-10"
          >
            {roadmap.episodes.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-[var(--text-3)]">{t('noEpisodes')}</p>
            ) : (
              <ul>
                {roadmap.episodes.map((episode) => (
                  <EpisodeRow key={episode.id} episode={episode} roadmapId={roadmap.id} />
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
