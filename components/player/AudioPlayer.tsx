'use client';
import { useMemo } from 'react';
import { usePlayerStore } from '@/lib/player-store';

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function barsFromId(id: string, count: number): { key: string; height: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const code = (id.codePointAt(i % id.length) ?? 0 + i * 17) % 100;
    return { key: `${id}-${i}`, height: 20 + (code % 80) };
  });
}

function SkipBackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6z M18 6L9.5 12 18 18z" />
    </svg>
  );
}

function SkipFwdIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12z M18 6h-2v12h2z" />
    </svg>
  );
}

export function AudioPlayer() {
  const {
    queue,
    currentTrackId,
    isPlaying,
    positionSeconds,
    duration,
    pause,
    resume,
    next,
    prev,
    seekTo,
  } = usePlayerStore();

  const currentTrack = queue.find((e) => e.id === currentTrackId) ?? null;
  const idx = queue.findIndex((e) => e.id === currentTrackId);
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < queue.length - 1;

  const bars = useMemo(() => barsFromId(currentTrack?.id ?? 'empty', 40), [currentTrack?.id]);
  const progress = duration > 0 ? positionSeconds / duration : 0;

  if (!currentTrack) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-[#5a5450]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#2c2828] bg-[#1e1c1c] text-2xl">
          🎙️
        </div>
        <p className="text-sm text-[#9e9792]">Select an episode to start listening</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes wv-pulse {
          from { transform: scaleY(0.55); }
          to   { transform: scaleY(1.05); }
        }
      `}</style>

      <div className="flex flex-col gap-6">
        {/* Episode info */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#e8a020]">
            Now Playing
          </p>
          <h2 className="mt-1.5 text-xl font-bold leading-snug text-[#f5f0eb]">
            {currentTrack.title}
          </h2>
          <p className="mt-1 text-sm capitalize text-[#9e9792]">
            {currentTrack.topic}
            {currentTrack.level ? ` · ${currentTrack.level}` : ''}
            {duration > 0 ? ` · ${formatTime(duration)}` : ''}
          </p>
        </div>

        {/* Animated waveform bars */}
        <div className="flex h-14 items-end gap-px rounded-xl bg-[#1e1c1c] px-4 py-2.5">
          {bars.map(({ key, height }, i) => (
            <div
              key={key}
              className="flex-1 rounded-full"
              style={{
                height: `${height}%`,
                background: progress > i / bars.length ? '#e8a020' : '#2c2828',
                animation: isPlaying
                  ? `wv-pulse 0.6s ease-in-out ${(i * 40) % 600}ms infinite alternate`
                  : 'none',
                transition: 'background 0.15s',
              }}
            />
          ))}
        </div>

        {/* Seek bar */}
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={positionSeconds}
            step={0.5}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-[#5a5450]">
            <span>{formatTime(positionSeconds)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls: prev · play/pause · next */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={!hasPrev}
            aria-label="Previous"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#9e9792] transition-colors hover:text-[#f5f0eb] disabled:opacity-25"
          >
            <SkipBackIcon />
          </button>

          <button
            onClick={isPlaying ? pause : resume}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#e8a020] text-black text-lg font-bold shadow-lg shadow-[#e8a020]/20 transition-all hover:bg-[#f5b030] active:scale-95"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            onClick={next}
            disabled={!hasNext}
            aria-label="Next"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#9e9792] transition-colors hover:text-[#f5f0eb] disabled:opacity-25"
          >
            <SkipFwdIcon />
          </button>
        </div>
      </div>
    </>
  );
}
