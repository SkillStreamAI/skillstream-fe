'use client';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'gradient';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  // Solid amber — the one CTA that demands attention
  primary:
    'bg-[#e8a020] text-black font-semibold ' +
    'hover:bg-[#f5b030] active:scale-[0.98] transition-all shadow-lg shadow-[#e8a020]/20',
  // Keep 'gradient' as alias for primary so old usage doesn't break
  gradient:
    'bg-[#e8a020] text-black font-semibold ' +
    'hover:bg-[#f5b030] active:scale-[0.98] transition-all shadow-lg shadow-[#e8a020]/20',
  outline:
    'border border-[#2c2828] bg-transparent text-[#f5f0eb] ' +
    'hover:border-[#e8a020]/50 hover:text-white transition-colors',
  ghost:
    'bg-transparent text-[#9e9792] hover:text-white hover:bg-[#1e1c1c] transition-colors',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
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
            className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black"
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
