import { create } from 'zustand';
import type { Episode } from './types';

export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
  queue: Episode[];
  currentTrackId: string | null;
  isPlaying: boolean;
  positionSeconds: number;
  duration: number;
  seekRequest: number | null;
  volume: number;        // 0–100
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;

  setQueue: (queue: Episode[]) => void;
  playTrack: (id: string) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (seconds: number) => void;
  clearSeekRequest: () => void;
  setPosition: (seconds: number) => void;
  setDuration: (seconds: number) => void;
  setIsPlaying: (v: boolean) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  clear: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentTrackId: null,
  isPlaying: false,
  positionSeconds: 0,
  duration: 0,
  seekRequest: null,
  volume: 80,
  isMuted: false,
  repeatMode: 'off',
  isShuffled: false,

  setQueue: (queue) => set({ queue }),

  playTrack: (id) =>
    set({ currentTrackId: id, isPlaying: true, positionSeconds: 0, duration: 0, seekRequest: null }),

  pause: () => set({ isPlaying: false }),

  resume: () => set({ isPlaying: true }),

  // Called by skip buttons — ignores repeatMode, respects shuffle
  next: () => {
    const { queue, currentTrackId, isShuffled } = get();
    if (isShuffled && queue.length > 1) {
      const currentIdx = queue.findIndex((e) => e.id === currentTrackId);
      let randomIdx: number;
      do { randomIdx = Math.floor(Math.random() * queue.length); }
      while (randomIdx === currentIdx);
      set({ currentTrackId: queue[randomIdx].id, isPlaying: true, positionSeconds: 0, duration: 0 });
      return;
    }
    const idx = queue.findIndex((e) => e.id === currentTrackId);
    if (idx >= 0 && idx < queue.length - 1) {
      set({ currentTrackId: queue[idx + 1].id, isPlaying: true, positionSeconds: 0, duration: 0 });
    } else {
      set({ isPlaying: false });
    }
  },

  prev: () => {
    const { queue, currentTrackId, positionSeconds } = get();
    if (positionSeconds > 3) {
      set({ seekRequest: 0, positionSeconds: 0 });
      return;
    }
    const idx = queue.findIndex((e) => e.id === currentTrackId);
    if (idx > 0) {
      set({ currentTrackId: queue[idx - 1].id, isPlaying: true, positionSeconds: 0, duration: 0 });
    } else {
      set({ seekRequest: 0, positionSeconds: 0 });
    }
  },

  seekTo: (seconds) => set({ seekRequest: seconds, positionSeconds: seconds }),

  clearSeekRequest: () => set({ seekRequest: null }),

  setPosition: (positionSeconds) => set({ positionSeconds }),

  setDuration: (duration) => set({ duration }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),

  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

  toggleRepeat: () =>
    set((s) => {
      const next: RepeatMode[] = ['off', 'all', 'one'];
      const i = next.indexOf(s.repeatMode);
      return { repeatMode: next[(i + 1) % 3] };
    }),

  toggleShuffle: () => set((s) => ({ isShuffled: !s.isShuffled })),

  clear: () =>
    set({ queue: [], currentTrackId: null, isPlaying: false, positionSeconds: 0, duration: 0, seekRequest: null }),
}));
