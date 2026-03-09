'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { TrendSuggestion } from '@/lib/types';

const AGENTS = [
  {
    id: 'trends',
    name: 'Trend Discovery',
    tagline: 'Surfaces what the tech world is learning right now',
    description:
      'Uses Amazon Bedrock Strands and Tavily Search to scan Google Trends and developer communities, then distills the top learning opportunities for you.',
    live: true,
    poweredBy: ['Amazon Bedrock', 'Strands Agents', 'Tavily Search'],
  },
  {
    id: 'content',
    name: 'Content Lifecycle',
    tagline: 'Keeps your library fresh without manual effort',
    description:
      'Monitors published roadmaps, detects stale content, and triggers re-generation automatically via Step Functions.',
    live: false,
    poweredBy: ['Step Functions', 'DynamoDB', 'EventBridge'],
  },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#2c2828] bg-[#161414] p-5 animate-pulse">
      <div className="mb-3 h-5 w-24 rounded-full bg-[#1e1c1c]" />
      <div className="mb-2 h-4 w-3/4 rounded bg-[#1e1c1c]" />
      <div className="h-3 w-full rounded bg-[#1e1c1c]" />
      <div className="mt-1 h-3 w-5/6 rounded bg-[#1e1c1c]" />
      <div className="mt-4 h-3 w-2/3 rounded bg-[#1e1c1c]" />
    </div>
  );
}

function TrendCard({ s, idx }: Readonly<{ s: TrendSuggestion; idx: number }>) {
  return (
    <div
      className="card-fade-in flex flex-col rounded-2xl border border-[#2c2828] bg-[#161414] p-5 gap-4 transition-colors hover:bg-[#1a1818] hover:border-[#3a3535]"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      {/* Topic + index */}
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8a020]/25 bg-[#e8a020]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#e8a020]">
          <span className="h-1 w-1 rounded-full bg-[#e8a020]" />
          {s.topic}
        </span>
        <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#1e1c1c] text-[10px] font-bold text-[#5a5450]">
          {idx + 1}
        </span>
      </div>

      {/* Trend title */}
      <p className="text-sm font-semibold text-[#f5f0eb] leading-snug">{s.trend_title}</p>

      {/* Why it's trending */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5a5450]">Why it&apos;s trending</p>
        <p className="text-xs text-[#9e9792] leading-relaxed">{s.reason}</p>
      </div>

      {/* Learning angle */}
      <div className="mt-auto rounded-xl border border-[#e8a020]/15 bg-[#e8a020]/5 p-3 flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#e8a020]">Learning angle</p>
        <p className="text-xs text-[#c8900a] leading-relaxed">{s.learning_angle}</p>
      </div>

      {/* CTA */}
      <Link
        href="/roadmaps"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#2c2828]
          px-4 py-2 text-xs font-medium text-[#9e9792] transition-all
          hover:border-[#e8a020]/30 hover:text-[#f5f0eb] hover:bg-[#1e1c1c]"
      >
        View roadmaps
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

function TrendsPanel() {
  const [suggestions, setSuggestions] = useState<TrendSuggestion[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [source, setSource]           = useState('');

  const doFetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geo: 'US' }),
      });
      const data = await res.json() as { suggestions?: TrendSuggestion[]; source?: string; error?: string };
      if (data.suggestions?.length) {
        setSuggestions(data.suggestions.slice(0, 5));
        setSource(data.source ?? '');
      } else {
        setError(data.error ?? 'No suggestions returned');
      }
    } catch {
      setError('Could not reach the trends agent');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void doFetch(); }, [doFetch]);

  return (
    <div className="mt-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#f5f0eb]">Trending Topics</p>
          {source && <p className="mt-0.5 text-xs text-[#5a5450]">via {source}</p>}
        </div>
        <button
          onClick={() => void doFetch()}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-full border border-[#2c2828] bg-[#161414] px-3 py-1.5
            text-xs text-[#9e9792] transition-all hover:border-[#e8a020]/30 hover:text-[#f5f0eb]
            disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg
            width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={loading ? { animation: 'spin 0.8s linear infinite' } : undefined}
          >
            <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          Refresh
        </button>
      </div>

      {!loading && error && (
        <div className="mb-4 rounded-xl border border-red-900/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          {error}{' '}
          <button onClick={() => void doFetch()} className="underline hover:text-red-300 cursor-pointer">
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : suggestions.map((s, i) => <TrendCard key={s.topic} s={s} idx={i} />)
        }
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const [activeAgent, setActiveAgent] = useState('trends');

  return (
    <div>
      {/* ── 3D grid page header ─── */}
      <div className="relative overflow-hidden border-b border-[#2c2828] px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(44,40,40,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(44,40,40,0.7) 1px,transparent 1px)', backgroundSize:'48px 48px', transform:'perspective(700px) rotateX(60deg) scaleX(1.4) translateY(-15%)', transformOrigin:'50% 0%', opacity:0.55 }} />
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 35% at 50% 100%,rgba(232,160,32,0.10) 0%,transparent 70%)' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,#0d0c0c 0%,transparent 35%,transparent 65%,#0d0c0c 100%)' }} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#2c2828] bg-[#161414] px-3 py-1 text-xs font-medium text-[#9e9792]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8a020] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e8a020]" />
            </span>
            Agentic AI
          </div>
          <h1 className="text-3xl font-bold text-[#f5f0eb] sm:text-4xl">
            AI Agents
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[#9e9792] sm:text-base">
            Autonomous agents that keep SkillStream fresh — discovering trends, managing content, and surfacing what matters.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* mb-10 spacer replaced by the header above */}

      {/* Agent selector */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {AGENTS.map((agent) => {
          const isActive = activeAgent === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => agent.live && setActiveAgent(agent.id)}
              disabled={!agent.live}
              className={`text-left rounded-2xl transition-all cursor-pointer disabled:cursor-default ${
                isActive ? 'gradient-border-animated glow-active' : 'gradient-border'
              } ${!agent.live ? 'opacity-50' : ''}`}
            >
              <div className={`flex h-full flex-col gap-3 rounded-2xl bg-[#161414] p-5 transition-colors ${agent.live ? 'hover:bg-[#1a1818]' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
                    agent.live
                      ? 'border-emerald-800/40 bg-emerald-950/30 text-emerald-400'
                      : 'border-[#2c2828] bg-[#1e1c1c] text-[#5a5450]'
                  }`}>
                    {agent.live && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                    {agent.live ? 'Live' : 'Coming soon'}
                  </span>
                  {isActive && <span className="text-[10px] font-semibold text-[#e8a020] uppercase tracking-wider">Active</span>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f5f0eb]">{agent.name}</p>
                  <p className="mt-0.5 text-xs text-[#9e9792] leading-relaxed">{agent.tagline}</p>
                </div>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {agent.poweredBy.map((t) => (
                    <span key={t} className="rounded-full border border-[#2c2828] bg-[#1e1c1c] px-2 py-0.5 text-[10px] text-[#5a5450]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active agent output */}
      {activeAgent === 'trends' && (
        <div className="gradient-border rounded-2xl">
          <div className="rounded-2xl bg-[#161414] p-5 sm:p-8">
            <div className="flex items-start gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#f5f0eb]">Trend Discovery Agent</h2>
                  <span className="flex items-center gap-1 rounded-full border border-emerald-800/40 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Running
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#9e9792] max-w-lg">{AGENTS[0].description}</p>
              </div>
            </div>
            <TrendsPanel />
          </div>
        </div>
      )}
      </div>{/* /inner content wrapper */}
    </div>
  );
}
