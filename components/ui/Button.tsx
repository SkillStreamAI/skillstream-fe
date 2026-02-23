'use client';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'gradient' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  gradient:
    'bg-[linear-gradient(135deg,#7c3aed,#2563eb,#0d9488)] text-white font-semibold ' +
    'shadow-lg shadow-purple-900/30 hover:opacity-90 active:scale-[0.98] transition-all',
  outline:
    'border border-[#2a2a2a] bg-transparent text-[#ededed] ' +
    'hover:border-[#7c3aed] hover:text-white transition-colors',
  ghost:
    'bg-transparent text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] transition-colors',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export function Button({
  variant = 'gradient',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
          Loading…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
