'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { ContentRoadmap, ContentEpisode } from '@/lib/types';
import { getContent } from '@/lib/lambda';

interface Agent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  live: boolean;
  poweredBy: string[];
}

interface ChapterRow extends ContentEpisode {
  roadmapTopic: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function ChapterSkeletonRow() {
  return (
    <div className="flex flex-col gap-2 border-b border-[var(--border)] py-4 animate-pulse last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="h-4 w-48 rounded bg-[var(--surface-2)]" />
        <div className="h-4 w-24 rounded bg-[var(--surface-2)]" />
      </div>
      <div className="h-3 w-full rounded bg-[var(--surface-2)]" />
      <div className="h-3 w-4/5 rounded bg-[var(--surface-2)]" />
    </div>
  );
}

function ChaptersList() {
  const t = useTranslations('agents');
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    getContent()
      .then((roadmaps: ContentRoadmap[]) => {
        const rows: ChapterRow[] = roadmaps.flatMap((r) =>
          r.episodes
            .filter((ep) => ep.generated_by === 'trends_agent')
            .map((ep) => ({ ...ep, roadmapTopic: r.topic })),
        );
        rows.sort((a, b) => {
          if (!a.created_at) return 1;
          if (!b.created_at) return -1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setChapters(rows);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mt-6">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[var(--text-1)]">{t('trendingTopics')}</p>
        <p className="mt-0.5 text-xs text-[var(--text-3)]">{t('trendingSubtitle')}</p>
      </div>

      {loading && (
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <ChapterSkeletonRow key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-900/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && chapters.length === 0 && (
        <p className="text-xs text-[var(--text-3)]">{t('noChapters')}</p>
      )}

      {!loading && !error && chapters.length > 0 && (
        <div className="divide-y divide-[var(--border)]">
          {chapters.map((ch, idx) => (
            <div
              key={ch.id}
              className="card-fade-in flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm font-semibold text-[var(--text-1)] leading-snug">{ch.title}</p>
                {ch.created_at && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-2)]">
                    {formatDate(ch.created_at)}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">{ch.overview}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoadmapSkeletonRow() {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] py-3 animate-pulse last:border-b-0">
      <div className="h-4 w-48 rounded bg-[var(--surface-2)]" />
      <div className="h-3 w-24 rounded bg-[var(--surface-2)]" />
    </div>
  );
}

function ContentLifecyclePanel() {
  const t = useTranslations('agents');
  const [roadmaps, setRoadmaps] = useState<ContentRoadmap[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    getContent()
      .then((data: ContentRoadmap[]) => setRoadmaps(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  function lastUpdated(roadmap: ContentRoadmap): string | null {
    const dates = roadmap.episodes
      .map((ep) => ep.created_at)
      .filter((d): d is string => !!d)
      .map((d) => new Date(d).getTime())
      .filter((t) => !isNaN(t));
    if (dates.length === 0) return null;
    return formatDate(new Date(Math.max(...dates)).toISOString());
  }

  return (
    <div className="mt-6">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[var(--text-1)]">{t('roadmapLibrary')}</p>
        <p className="mt-0.5 text-xs text-[var(--text-3)]">{t('roadmapSubtitle')}</p>
      </div>

      {loading && (
        <div>
          {Array.from({ length: 5 }).map((_, i) => <RoadmapSkeletonRow key={i} />)}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-900/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && roadmaps.length === 0 && (
        <p className="text-xs text-[var(--text-3)]">{t('noRoadmaps')}</p>
      )}

      {!loading && !error && roadmaps.length > 0 && (
        <div className="divide-y divide-[var(--border)]">
          {roadmaps.map((rm, idx) => {
            const date = lastUpdated(rm);
            return (
              <div
                key={rm.id}
                className="card-fade-in flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <p className="text-sm text-[var(--text-1)] font-medium leading-snug">{rm.title || rm.topic}</p>
                {date ? (
                  <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-2)]">
                    {date}
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-[var(--text-3)]">—</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AgentsPage() {
  const t = useTranslations('agents');
  const [activeAgent, setActiveAgent] = useState('trends');

  const AGENTS: Agent[] = [
    {
      id: 'trends',
      name: t('trendDiscovery'),
      tagline: t('trendTagline'),
      description: t('trendDesc'),
      live: true,
      poweredBy: ['Amazon Bedrock', 'Strands Agents', 'Tavily Search'],
    },
    {
      id: 'content',
      name: t('contentLifecycle'),
      tagline: t('contentTagline'),
      description: t('contentDesc'),
      live: true,
      poweredBy: ['Step Functions', 'DynamoDB', 'EventBridge'],
    },
  ];

  return (
    <div>
      {/* ── Hero header ── */}
      <div className="hero-gradient border-b border-[var(--border)] px-4 pt-20 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-2)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8a020] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e8a020]" />
            </span>
            {t('agenticLabel')}
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-1)] sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-3 text-sm text-[var(--text-2)] sm:text-base">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Agent selector */}
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        {AGENTS.map((agent) => {
          const isActive = activeAgent === agent.id;
          const accentColor = agent.id === 'trends' ? '#22d3ee' : '#34d399';
          return (
            <button
              key={agent.id}
              type="button"
              disabled={!agent.live}
              onClick={() => agent.live && setActiveAgent(agent.id)}
              style={{
                opacity: agent.live ? 1 : 0.5,
                borderColor: isActive ? accentColor + '60' : undefined,
                boxShadow: isActive ? `0 0 0 1px ${accentColor}30, inset 0 1px 0 rgba(255,255,255,0.08)` : undefined,
              }}
              className={`glass-panel w-full p-5 text-left transition-all ${
                agent.live ? 'cursor-pointer' : 'cursor-default'
              } ${isActive ? 'glow-active' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-sm font-semibold text-[var(--text-1)]">{agent.name}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      agent.live
                        ? 'bg-emerald-500 text-white'
                        : 'border border-white/10 bg-white/5 text-[var(--text-3)]'
                    }`}>
                      {agent.live ? t('liveBadge') : t('comingSoon')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-2)] leading-relaxed">{agent.tagline}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {agent.poweredBy.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-[var(--text-2)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {isActive && (
                  <div
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active agent output */}
      {activeAgent === 'content' && (
        <div className="glass-panel p-5 sm:p-8">
            <div className="flex items-start gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[var(--text-1)]">{t('contentLifecycleAgent')}</h2>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse" />{' '}{t('running')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--text-2)] max-w-lg">{AGENTS[1].description}</p>
              </div>
            </div>
            <ContentLifecyclePanel />
        </div>
      )}

      {activeAgent === 'trends' && (
        <div className="glass-panel p-5 sm:p-8">
            <div className="flex items-start gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[var(--text-1)]">{t('trendDiscoveryAgent')}</h2>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse" />{' '}{t('running')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--text-2)] max-w-lg">{AGENTS[0].description}</p>
              </div>
            </div>
            <ChaptersList />
        </div>
      )}
      </div>{/* /inner content wrapper */}
    </div>
  );
}
