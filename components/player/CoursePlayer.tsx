'use client';
import { useRef, useState, useEffect } from 'react';
import {
  Play, Pause, SkipForward, SkipBack,
  Repeat, Shuffle, Volume2, VolumeX, List, X, Maximize2, Minimize2,
} from 'lucide-react';
import { usePlayerStore } from '@/lib/player-store';
import type { Episode } from '@/lib/types';

interface Props {
  courseTopic: string;
  courseTitle: string;
  episodes: Episode[];
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Map topic → gradient pair (deterministic by hash)
const GRADIENTS = [
  ['#4c1d95', '#1e3a8a'], // violet → blue
  ['#1e3a8a', '#134e4a'], // blue → teal
  ['#134e4a', '#78350f'], // teal → amber-dark
  ['#78350f', '#7f1d1d'], // amber-dark → red-dark
  ['#4a1d96', '#831843'], // purple → rose
] as const;

function topicGradient(topic: string) {
  const hash = topic.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
}

// CSS-only equalizer bars (no Web Audio needed for visual-only)
function EqualizerBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <>
      <style>{`
        @keyframes eq {
          0%,100% { transform: scaleY(0.2); }
          50%      { transform: scaleY(1); }
        }
      `}</style>
      <div className="flex items-end gap-1" style={{ height: 56 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full"
            style={{
              height: '100%',
              transformOrigin: 'bottom',
              background: `linear-gradient(to top, #e8a020, #fbbf24)`,
              opacity: 0.75,
              animation: isPlaying
                ? `eq ${0.5 + (i % 4) * 0.15}s ease-in-out ${i * 0.07}s infinite`
                : 'none',
              transform: isPlaying ? undefined : 'scaleY(0.12)',
              transition: 'transform 0.4s ease',
            }}
          />
        ))}
      </div>
    </>
  );
}

export function CoursePlayer({ courseTopic, courseTitle, episodes }: Props) {
  const {
    queue,
    currentTrackId,
    isPlaying,
    positionSeconds,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    pause,
    resume,
    next,
    prev,
    seekTo,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    playTrack,
  } = usePlayerStore();

  const progressRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [showQueue, setShowQueue] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentTrack = queue.find((e) => e.id === currentTrackId) ?? null;
  const currentIdx = queue.findIndex((e) => e.id === currentTrackId);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx >= 0 && currentIdx < queue.length - 1;
  const progress = duration > 0 ? positionSeconds / duration : 0;
  const epNum = episodes.findIndex((e) => e.id === currentTrackId) + 1;
  const [gradStart, gradEnd] = topicGradient(courseTopic);

  // Progress bar interaction
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const { left, width } = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - left) / width));
    seekTo(pct * (duration || 0));
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const { left, width } = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - left) / width));
    setHoverTime(pct * (duration || 0));
  };

  // Keyboard shortcuts (Space, ←→ seek, ↑↓ volume)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.code) {
        case 'Space':     e.preventDefault(); isPlaying ? pause() : resume(); break;
        case 'ArrowLeft': e.preventDefault(); seekTo(Math.max(0, positionSeconds - 10)); break;
        case 'ArrowRight':e.preventDefault(); seekTo(Math.min(duration, positionSeconds + 10)); break;
        case 'ArrowUp':   e.preventDefault(); setVolume(Math.min(100, volume + 10)); break;
        case 'ArrowDown': e.preventDefault(); setVolume(Math.max(0, volume - 10)); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlaying, positionSeconds, duration, volume]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close volume popup on outside click
  useEffect(() => {
    if (!showVolume) return;
    const close = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-volume-panel]')) setShowVolume(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showVolume]);

  return (
    <div className="relative w-full">
      {/* ── Main card ─────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/60">

        {/* Hero / artwork area */}
        <div
          className="relative overflow-hidden transition-all duration-500"
          style={{
            height: isExpanded ? 288 : 200,
            background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
          }}
        >
          {/* Fade to card bg at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />

          {/* Equalizer centered in hero */}
          <div className="absolute inset-0 flex items-center justify-center">
            <EqualizerBars isPlaying={isPlaying} />
          </div>

          {/* Episode badge */}
          {epNum > 0 && (
            <div className="absolute left-3 top-3 rounded-full border border-[#e8a020]/30 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--amber)] backdrop-blur-sm">
              Ep {epNum} / {episodes.length}
            </div>
          )}

          {/* Expand toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/60 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
            aria-label={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>

        {/* ── Content ───────────────────────────────────── */}
        <div className="p-5">

          {/* Track info */}
          <div className="mb-5">
            <h2 className="truncate text-base font-bold text-[var(--text-1)]">
              {currentTrack?.title ?? 'Select an episode to begin'}
            </h2>
            <p className="mt-0.5 truncate text-xs text-[var(--text-3)]">
              {courseTopic} · {courseTitle}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div
              ref={progressRef}
              className="group relative h-1.5 cursor-pointer overflow-visible rounded-full bg-[var(--border)]"
              onClick={handleProgressClick}
              onMouseMove={handleProgressHover}
              onMouseLeave={() => setHoverTime(null)}
            >
              {/* Fill */}
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[var(--amber)]"
                style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                style={{ left: `${progress * 100}%`, marginLeft: -7 }}
              />
              {/* Hover time tooltip */}
              {hoverTime !== null && (
                <div
                  className="pointer-events-none absolute -top-8 rounded-md bg-black/90 px-2 py-1 text-[10px] text-white backdrop-blur-sm"
                  style={{ left: `${(hoverTime / (duration || 1)) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  {fmt(hoverTime)}
                </div>
              )}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-[var(--text-3)]">
              <span>{fmt(positionSeconds)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">

            {/* Left: shuffle + repeat */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={toggleShuffle}
                aria-label="Shuffle"
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                  isShuffled ? 'text-[var(--amber)]' : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
                }`}
              >
                <Shuffle size={13} />
              </button>
              <button
                onClick={toggleRepeat}
                aria-label="Repeat"
                className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                  repeatMode !== 'off' ? 'text-[var(--amber)]' : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
                }`}
              >
                <Repeat size={13} />
                {repeatMode === 'one' && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--amber)] text-[8px] font-bold text-black">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Center: prev · play/pause · next */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev} disabled={!hasPrev} aria-label="Previous"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--text-2)] transition-colors hover:text-[var(--text-1)] disabled:opacity-25"
              >
                <SkipBack size={17} />
              </button>

              <button
                onClick={isPlaying ? pause : resume}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[var(--amber)] text-black shadow-lg shadow-[var(--amber)]/25 transition-all hover:scale-105 hover:bg-[#f5b030] active:scale-95"
              >
                {isPlaying
                  ? <Pause size={20} className="fill-black" />
                  : <Play size={20} className="ml-0.5 fill-black" />
                }
              </button>

              <button
                onClick={next} disabled={!hasNext} aria-label="Next"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--text-2)] transition-colors hover:text-[var(--text-1)] disabled:opacity-25"
              >
                <SkipForward size={17} />
              </button>
            </div>

            {/* Right: volume + queue */}
            <div className="relative flex items-center gap-0.5" data-volume-panel>
              <button
                onClick={() => setShowVolume(!showVolume)}
                aria-label="Volume"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--text-3)] transition-colors hover:text-[var(--text-2)]"
              >
                {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>

              <button
                onClick={() => setShowQueue(!showQueue)}
                aria-label="Queue"
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                  showQueue ? 'text-[var(--amber)]' : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
                }`}
              >
                <List size={13} />
              </button>

              {/* Volume popup */}
              {showVolume && (
                <div className="absolute bottom-full right-0 z-20 mb-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="cursor-pointer text-[var(--text-3)] transition-colors hover:text-[var(--text-2)]">
                      {isMuted || volume === 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    </button>
                    <input
                      type="range" min={0} max={100} value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-24 cursor-pointer"
                      aria-label="Volume"
                    />
                    <span className="w-7 text-right text-[10px] text-[var(--text-3)]">{isMuted ? 0 : volume}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Inline queue panel ────────────────────────── */}
      {showQueue && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <h3 className="text-sm font-semibold text-[var(--text-1)]">
              Queue <span className="text-[var(--text-3)]">({episodes.length})</span>
            </h3>
            <button onClick={() => setShowQueue(false)} className="cursor-pointer text-[var(--text-3)] transition-colors hover:text-[var(--text-2)]">
              <X size={14} />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto pb-2">
            {episodes.map((ep, i) => {
              const active = ep.id === currentTrackId;
              return (
                <button
                  key={ep.id}
                  onClick={() => playTrack(ep.id)}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--surface-2)] ${
                    active ? 'bg-[var(--amber)]/8' : ''
                  }`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                    active ? 'bg-[var(--amber)] text-black' : 'bg-[var(--border)] text-[var(--text-3)]'
                  }`}>
                    {active ? '♪' : i + 1}
                  </span>
                  <p className={`flex-1 truncate text-xs ${active ? 'font-medium text-[var(--text-1)]' : 'text-[var(--text-2)]'}`}>
                    {ep.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
