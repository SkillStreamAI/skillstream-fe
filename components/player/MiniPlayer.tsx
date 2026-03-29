'use client';
import { useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { usePlayerStore } from '@/lib/player-store';
import { WaveformVisualizer } from './WaveformVisualizer';

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function SkipBackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6z M18 6L9.5 12 18 18z" />
    </svg>
  );
}
function SkipFwdIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12z M18 6h-2v12h2z" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

export function MiniPlayer() {
  const {
    queue,
    currentTrackId,
    isPlaying,
    positionSeconds,
    duration,
    seekRequest,
    volume,
    isMuted,
    repeatMode,
    pause,
    resume,
    next,
    setPosition,
    setDuration,
    setIsPlaying,
    clearSeekRequest,
    clear,
  } = usePlayerStore();

  const pathname = usePathname();
  const tPlayer = useTranslations('player');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  const currentTrack = queue.find((e) => e.id === currentTrackId) ?? null;
  const idx = queue.findIndex((e) => e.id === currentTrackId);
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < queue.length - 1;
  const progress = duration > 0 ? positionSeconds / duration : 0;

  // Sync currentTrackId → audio src
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!currentTrack) { audio.pause(); audio.src = ''; return; }
    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
      audio.load();
    }
  }, [currentTrackId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync isPlaying → play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync volume/muted → audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted, audioEl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle seek requests
  useEffect(() => {
    if (seekRequest === null) return;
    const audio = audioRef.current;
    if (audio) audio.currentTime = seekRequest;
    clearSeekRequest();
  }, [seekRequest]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hide mini bar on all player routes — the full player page handles UI there
  const isPlayerPage = pathname.startsWith('/player');

  return (
    <>
      {/* Single <audio> element — always mounted so playback persists across navigation */}
      <audio
        ref={(el) => {
          audioRef.current = el;
          if (el && el !== audioEl) setAudioEl(el);
        }}
        onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          if (isPlaying) e.currentTarget.play().catch(() => setIsPlaying(false));
        }}
        onEnded={() => {
          // Respect repeatMode without coupling store logic here
          const { repeatMode: mode, queue: q, currentTrackId: ctid } = usePlayerStore.getState();
          const audio = audioRef.current;
          if (mode === 'one' && audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
          } else if (mode === 'all') {
            const i = q.findIndex((e) => e.id === ctid);
            const nextId = i === q.length - 1 ? q[0]?.id : q[i + 1]?.id;
            if (nextId) usePlayerStore.getState().playTrack(nextId);
          } else {
            next();
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <track kind="captions" />
      </audio>

      {/* Mini bar — hidden while on any /player route */}
      <AnimatePresence>
        {currentTrackId && !isPlayerPage && (
          <motion.div
            key="mini-player"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2c2828] bg-[#0d0c0c]/95 backdrop-blur-lg"
          >
            {/* Thin seek scrubber */}
            <div className="relative h-0.5 bg-[#1e1c1c]">
              <div
                className="absolute left-0 top-0 h-full bg-[#e8a020]"
                style={{ width: `${progress * 100}%`, transition: 'width 0.25s linear' }}
              />
              <input
                type="range" min={0} max={duration || 1} value={positionSeconds} step={0.5}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = v;
                  setPosition(v);
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 mini-player-progress"
                aria-label={tPlayer('seek')}
              />
            </div>

            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
              <WaveformVisualizer
                audioElement={audioEl} isPlaying={isPlaying}
                width={72} height={24} barCount={18}
                className="hidden shrink-0 rounded sm:block"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#f5f0eb]">{currentTrack?.title ?? '—'}</p>
                <p className="truncate text-xs text-[#5a5450]">
                  {currentTrack?.topic}
                  {duration > 0 && ` · ${fmt(positionSeconds)} / ${fmt(duration)}`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => usePlayerStore.getState().prev()} disabled={!hasPrev} aria-label={tPlayer('previous')}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#9e9792] transition-colors hover:text-[#f5f0eb] disabled:opacity-25">
                  <SkipBackIcon />
                </button>
                <button onClick={isPlaying ? pause : resume} aria-label={isPlaying ? tPlayer('pause') : tPlayer('play')}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#e8a020] text-black transition-all hover:bg-[#f5b030] active:scale-95">
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button onClick={() => usePlayerStore.getState().next()} disabled={!hasNext} aria-label={tPlayer('next')}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#9e9792] transition-colors hover:text-[#f5f0eb] disabled:opacity-25">
                  <SkipFwdIcon />
                </button>
                <button onClick={clear} aria-label={tPlayer('closePlayer')}
                  className="ml-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#5a5450] transition-colors hover:text-[#9e9792]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
