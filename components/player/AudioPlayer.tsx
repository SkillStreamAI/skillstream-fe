'use client';
import { useRef, useState, useEffect, useMemo } from 'react';
import type { Episode } from '@/lib/types';

interface AudioPlayerProps {
  episode: Episode | null;
  onEnded?: () => void;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Generate deterministic bar heights from episode id (avoids hydration mismatch)
function barsFromId(id: string, count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const code = (id.charCodeAt(i % id.length) + i * 17) % 100;
    return 20 + (code % 80); // 20–100%
  });
}

export function AudioPlayer({ episode, onEnded }: AudioPlayerProps) {
  const audioRef                = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset player state whenever the episode changes
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [episode?.id]);

  const bars = useMemo(
    () => barsFromId(episode?.id ?? 'empty', 40),
    [episode?.id]
  );

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    console.log('Audio src:', audio.src, '| episode audioUrl:', episode?.audioUrl);
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.error('Audio play failed:', err);
          setPlaying(false);
        });
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) audioRef.current.currentTime = value;
    setCurrent(value);
  };

  if (!episode) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-[#52525b]">
        <div className="text-4xl">🎙️</div>
        <p className="text-sm">Select an episode to start listening</p>
      </div>
    );
  }

  const progress = duration > 0 ? current / duration : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Episode info */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed]">
          Now Playing
        </p>
        <h2 className="mt-1 text-xl font-bold text-white leading-snug">
          {episode.title}
        </h2>
        <p className="mt-0.5 text-sm capitalize text-[#a1a1aa]">
          {episode.topic} · {episode.level} · {episode.durationMin} min
        </p>
      </div>

      {/* Waveform visualizer */}
      <div className="flex h-16 items-end gap-0.5 rounded-xl bg-[#1a1a1a] px-4 py-3">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all"
            style={{
              height: `${h}%`,
              background:
                progress > i / bars.length
                  ? 'linear-gradient(to top, #7c3aed, #2563eb)'
                  : '#2a2a2a',
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
          value={current}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
        <div className="flex items-center justify-between text-xs text-[#52525b]">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play / Pause */}
      <div className="flex justify-center">
        <button
          onClick={toggle}
          className="flex h-14 w-14 items-center justify-center rounded-full cursor-pointer
            bg-[linear-gradient(135deg,#7c3aed,#2563eb)] text-white text-xl
            shadow-lg shadow-purple-900/40 hover:opacity-90 active:scale-95 transition-all"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={episode.audioUrl || undefined}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          setPlaying(false);
          onEnded?.();
        }}
      />
    </div>
  );
}
