'use client';
import { useRef, useEffect } from 'react';

interface Props {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  barCount?: number;
  width?: number;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
}

export function WaveformVisualizer({
  audioElement,
  isPlaying,
  barCount = 24,
  width = 120,
  height = 32,
  activeColor = '#e8a020',
  inactiveColor = '#2c2828',
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const connectedRef = useRef(false);

  // Connect audio element → AudioContext → AnalyserNode on first play
  useEffect(() => {
    if (!audioElement || connectedRef.current) return;

    const connect = () => {
      if (connectedRef.current) return;
      try {
        const ac = new AudioContext();
        const analyser = ac.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.85;
        const source = ac.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(ac.destination);
        acRef.current = ac;
        analyserRef.current = analyser;
        connectedRef.current = true;
      } catch (err) {
        console.warn('[WaveformVisualizer]', err);
      }
    };

    // Defer setup to first play so AudioContext starts with a user gesture
    audioElement.addEventListener('play', connect, { once: true });
    return () => audioElement.removeEventListener('play', connect);
  }, [audioElement]);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    cancelAnimationFrame(rafRef.current);

    const bw = Math.max(1, Math.floor((width - barCount + 1) / barCount));

    const drawBars = (values: number[]) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < barCount; i++) {
        const v = values[i] ?? 0;
        const bh = Math.max(2, v * height);
        const x = i * (bw + 1);
        ctx.fillStyle = v > 0.05 ? activeColor : inactiveColor;
        ctx.fillRect(x, height - bh, bw, bh);
      }
    };

    if (!isPlaying || !analyserRef.current) {
      // Static idle bars
      drawBars(Array.from({ length: barCount }, (_, i) => 0.04 + (i % 4) * 0.025));
      return;
    }

    acRef.current?.resume();
    const analyser = analyserRef.current;
    const bufLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);

    const animate = () => {
      analyser.getByteFrequencyData(data);
      drawBars(
        Array.from({ length: barCount }, (_, i) => {
          const idx = Math.floor((i * bufLen) / barCount);
          return data[idx] / 255;
        }),
      );
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, width, height, barCount, activeColor, inactiveColor]);

  return <canvas ref={canvasRef} width={width} height={height} className={className} />;
}
