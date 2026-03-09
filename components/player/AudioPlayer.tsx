'use client';
import { useRef, useState, useEffect, useMemo } from 'react';
import type { Episode } from '@/lib/types';

interface AudioPlayerProps {
  readonly episode: Episode | null;
  readonly onEnded?: () => void;
}

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

export function AudioPlayer({ episode, onEnded }: AudioPlayerProps) {
  const audioRef                = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [episode?.id]);

  const bars = useMemo(() => barsFromId(episode?.id ?? 'empty', 40), [episode?.id]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio?.src) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play()
        .then(() => setPlaying(true))
        .catch((err) => { console.error('Audio play failed:', err); setPlaying(false); });
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) audioRef.current.currentTime = value;
    setCurrent(value);
  };

  if (!episode) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-[#5a5450]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#2c2828] bg-[#1e1c1c] text-2xl">
          🎙️
        </div>
        <p className="text-sm text-[#9e9792]">Select an episode to start listening</p>
      </div>
    );
  }

  const progress = duration > 0 ? current / duration : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Episode info */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#e8a020]">
          Now Playing
        </p>
        <h2 className="mt-1.5 text-xl font-bold text-[#f5f0eb] leading-snug">
          {episode.title}
        </h2>
        <p className="mt-1 text-sm capitalize text-[#9e9792]">
          {episode.topic}
          {episode.level ? ` · ${episode.level}` : ''}
          {duration > 0 ? ` · ${formatTime(duration)}` : ''}
        </p>
      </div>

      {/* Waveform visualizer */}
      <div className="flex h-14 items-end gap-px rounded-xl bg-[#1e1c1c] px-4 py-2.5">
        {bars.map(({ key, height }, i) => (
          <div
            key={key}
            className="flex-1 rounded-full transition-all duration-150"
            style={{
              height: `${height}%`,
              background: progress > i / bars.length ? '#e8a020' : '#2c2828',
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
        <div className="flex items-center justify-between text-xs text-[#5a5450]">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play / Pause */}
      <div className="flex justify-center">
        <button
          onClick={toggle}
          className="flex h-14 w-14 items-center justify-center rounded-full cursor-pointer
            bg-[#e8a020] text-black text-lg font-bold
            shadow-lg shadow-[#e8a020]/20 hover:bg-[#f5b030] active:scale-95 transition-all"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>

      <audio
        ref={audioRef}
        src={episode.audioUrl || undefined}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); onEnded?.(); }}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}
