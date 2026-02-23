'use client';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#a1a1aa]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-2.5',
          'text-sm text-[#ededed] placeholder:text-[#52525b]',
          'outline-none transition-all',
          'focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
