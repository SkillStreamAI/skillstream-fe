'use client';
import { cn } from '@/lib/utils';
import { type HTMLMotionProps, motion } from 'motion/react';

const GRADIENT_ANGLES = { top: 0, right: 90, bottom: 180, left: 270 };

type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  blurIntensity?: number;
  className?: string;
} & HTMLMotionProps<'div'>;

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 8,
  blurIntensity = 0.25,
  className,
  ...props
}: ProgressiveBlurProps) {
  const layers      = Math.max(blurLayers, 2);
  const segmentSize = 1 / (layers + 1);
  const angle       = GRADIENT_ANGLES[direction];

  return (
    <div className={cn('relative', className)}>
      {Array.from({ length: layers }).map((_, index) => {
        const stops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map((pos, pi) =>
          `rgba(255,255,255,${pi === 1 || pi === 2 ? 1 : 0}) ${pos * 100}%`
        );
        const mask = `linear-gradient(${angle}deg, ${stops.join(', ')})`;
        return (
          <motion.div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ maskImage: mask, WebkitMaskImage: mask, backdropFilter: `blur(${index * blurIntensity}px)` }}
            {...props}
          />
        );
      })}
    </div>
  );
}
