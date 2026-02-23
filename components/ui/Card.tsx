import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glowBorder?: boolean;
}

export function Card({ glowBorder = false, className = '', children, ...props }: CardProps) {
  const inner = (
    <div className={`rounded-xl bg-[#111] p-5 ${className}`} {...props}>
      {children}
    </div>
  );

  if (glowBorder) {
    return (
      <div className="gradient-border rounded-xl">
        {inner}
      </div>
    );
  }

  return inner;
}
