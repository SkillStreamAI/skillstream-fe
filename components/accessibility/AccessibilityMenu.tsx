'use client';

import { useEffect, useRef, useState } from 'react';
import { useA11y, type FontSize } from '@/lib/accessibility-context';
import { usePlayerStore } from '@/lib/player-store';

/* ── Icon ── */
function A11yIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M9 9h6M12 9v7" />
      <path d="M9 14l-2 3M15 14l2 3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Toggle switch ── */
function Toggle({ checked, onChange, label }: Readonly<{ checked: boolean; onChange: () => void; label: string }>) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm text-[var(--text-1)]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className="relative h-6 w-11 shrink-0 rounded-full border border-[var(--border)] transition-colors"
        style={{ background: checked ? 'var(--amber)' : 'var(--surface-2)' }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ left: checked ? 'calc(100% - 1.375rem)' : '0.125rem' }}
        />
      </button>
    </label>
  );
}

/* ── Font size buttons ── */
const FONT_SIZES: { value: FontSize; label: string; display: string }[] = [
  { value: 'normal', label: 'Normal text size',  display: 'A'   },
  { value: 'large',  label: 'Large text size',   display: 'A+'  },
  { value: 'larger', label: 'Largest text size', display: 'A++' },
];

export function AccessibilityMenu() {
  const { prefs, setFontSize, toggleReduceMotion, toggleHighContrast, reset } = useA11y();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const playerVisible = Boolean(currentTrackId);

  // Escape key + outside click to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    const onOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOutside);
    };
  }, [open]);

  // Move focus into panel when it opens
  useEffect(() => {
    if (open) {
      const first = panelRef.current?.querySelector<HTMLElement>('button, [role="switch"]');
      first?.focus();
    }
  }, [open]);

  // Focus trap inside panel
  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button, [role="switch"], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };

  const bottomClass = playerVisible ? 'bottom-28' : 'bottom-6';

  return (
    <div className={`fixed right-4 z-40 ${bottomClass} flex flex-col items-end gap-2`}>
      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility settings"
          onKeyDown={handlePanelKeyDown}
          className="glass-panel w-72 overflow-hidden p-4 shadow-2xl sm:w-80"
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-1)]">Accessibility</h2>
            <button
              type="button"
              onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
              aria-label="Close accessibility panel"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Font size */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-3)]">
              Text size
            </p>
            <div className="flex gap-2" role="group" aria-label="Text size options">
              {FONT_SIZES.map(({ value, label, display }) => {
                const active = prefs.fontSize === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    aria-label={label}
                    onClick={() => setFontSize(value)}
                    className="flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-bold transition-all"
                    style={{
                      background:   active ? 'var(--amber)'   : 'var(--surface-2)',
                      borderColor:  active ? 'var(--amber)'   : 'var(--border)',
                      color:        active ? '#000'           : 'var(--text-2)',
                    }}
                  >
                    {display}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4">
            <Toggle
              checked={prefs.reduceMotion}
              onChange={toggleReduceMotion}
              label="Reduce motion"
            />
            <Toggle
              checked={prefs.highContrast}
              onChange={toggleHighContrast}
              label="High contrast"
            />
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={reset}
            className="mt-4 w-full rounded-xl border border-[var(--border)] py-2 text-xs font-medium text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
          >
            Reset to defaults
          </button>
        </div>
      )}

      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Accessibility options"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{
          background:  open ? 'var(--amber)' : 'var(--surface)',
          color:       open ? '#000'         : 'var(--text-2)',
          border:      '1px solid var(--border)',
          boxShadow:   '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <A11yIcon />
      </button>
    </div>
  );
}
