'use client';
import { useState, useEffect, useCallback } from 'react';
import type { TrendSuggestion } from '@/lib/types';

interface TrendingSuggestionsProps {
  onSelect: (topic: string) => void;
  disabled?: boolean;
}

export function TrendingSuggestions({ onSelect, disabled }: TrendingSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TrendSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geo: 'US' }),
      });
      const data = await res.json();
      if (data.suggestions?.length) {
        setSuggestions(data.suggestions.slice(0, 5));
      } else {
        setError(data.error ?? 'No suggestions returned');
      }
    } catch {
      setError('Could not reach trends agent');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrends(); }, [fetchTrends]);

  return (
    <div className="mb-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🔥</span>
          <span className="text-sm font-semibold text-white">Trending Now</span>
          <span className="text-xs text-[#52525b]">— AI-curated from Google Trends</span>
        </div>
        <button
          type="button"
          onClick={fetchTrends}
          disabled={loading || disabled}
          title="Refresh trending topics"
          className="flex items-center gap-1 rounded-full border border-[#2a2a2a] bg-[#111] px-2 py-1
            text-xs text-[#a1a1aa] hover:border-[#7c3aed] hover:text-white transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshIcon spinning={loading} />
          Refresh
        </button>
      </div>

      {/* Skeleton state */}
      {loading && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-[#1a1a1a] animate-pulse"
              style={{ width: `${100 + i * 20}px` }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <p className="text-xs text-[#71717a]">
          Could not load trends.{' '}
          <button
            type="button"
            onClick={fetchTrends}
            className="underline hover:text-white transition-colors cursor-pointer"
          >
            Retry
          </button>
        </p>
      )}

      {/* Suggestion chips */}
      {!loading && !error && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <div key={i} className="relative">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(s.topic)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="gradient-border rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span
                  className="flex items-center gap-1.5 rounded-full bg-[#111] px-3 py-1
                    text-xs text-[#a1a1aa] hover:text-white transition-colors"
                >
                  <span className="text-[#7c3aed]">↗</span>
                  {s.trend_title}
                </span>
              </button>

              {/* Tooltip */}
              {hoveredIdx === i && (
                <div
                  className="absolute bottom-full left-0 mb-2 z-20 w-64 rounded-xl border border-[#2a2a2a]
                    bg-[#111] p-3 shadow-xl pointer-events-none"
                >
                  <p className="text-xs font-semibold text-white mb-1">{s.topic}</p>
                  <p className="text-xs text-[#a1a1aa] mb-2">{s.reason}</p>
                  <p className="text-xs text-[#7c3aed]">{s.learning_angle}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={spinning ? { animation: 'spin 0.8s linear infinite' } : undefined}
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}
