'use client';
import { useState, useEffect } from 'react';
import type { ContentRoadmap, ContentEpisode } from '@/lib/types';
import { getContent } from '@/lib/lambda';
import ThreeDLayeredCard from '@/components/ui/3d-layered-card';

const AGENTS = [
  {
    id: 'trends',
    name: 'Trend Discovery',
    tagline: 'Finds what the tech world is learning right now',
    description:
      'Scans Google Trends and developer communities using Amazon Bedrock Strands and Tavily Search, then surfaces the top learning topics worth adding to your roadmap.',
    live: true,
    poweredBy: ['Amazon Bedrock', 'Strands Agents', 'Tavily Search'],
  },
  {
    id: 'content',
    name: 'Content Lifecycle',
    tagline: 'Scans your roadmaps and checks that content stays current',
    description:
      'Reads every published roadmap, inspects the last time each one was updated, and flags entries that may be outdated — so your library never goes stale.',
    live: true,
    poweredBy: ['Step Functions', 'DynamoDB', 'EventBridge'],
  },
];

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
    <div className="flex flex-col gap-2 border-b border-[#2c2828] py-4 animate-pulse last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="h-4 w-48 rounded bg-[#1e1c1c]" />
        <div className="h-4 w-24 rounded bg-[#1e1c1c]" />
      </div>
      <div className="h-3 w-full rounded bg-[#1e1c1c]" />
      <div className="h-3 w-4/5 rounded bg-[#1e1c1c]" />
    </div>
  );
}

function ChaptersList() {
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
        <p className="text-sm font-semibold text-[#f5f0eb]">Trending Topics</p>
        <p className="mt-0.5 text-xs text-[#5a5450]">Latest audio episodes generated from trending topics</p>
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
        <p className="text-xs text-[#5a5450]">No chapters found yet.</p>
      )}

      {!loading && !error && chapters.length > 0 && (
        <div className="divide-y divide-[#2c2828]">
          {chapters.map((ch, idx) => (
            <div
              key={ch.id}
              className="card-fade-in flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm font-semibold text-[#f5f0eb] leading-snug">{ch.title}</p>
                {ch.created_at && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2c2828] bg-[#1e1c1c] px-3 py-1 text-xs text-[#9e9792]">
                    {formatDate(ch.created_at)}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9e9792] leading-relaxed">{ch.overview}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoadmapSkeletonRow() {
  return (
    <div className="flex items-center justify-between border-b border-[#2c2828] py-3 animate-pulse last:border-b-0">
      <div className="h-4 w-48 rounded bg-[#1e1c1c]" />
      <div className="h-3 w-24 rounded bg-[#1e1c1c]" />
    </div>
  );
}

function ContentLifecyclePanel() {
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
        <p className="text-sm font-semibold text-[#f5f0eb]">Roadmap Library</p>
        <p className="mt-0.5 text-xs text-[#5a5450]">Showing the last time each roadmap received new content</p>
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
        <p className="text-xs text-[#5a5450]">No roadmaps found.</p>
      )}

      {!loading && !error && roadmaps.length > 0 && (
        <div className="divide-y divide-[#2c2828]">
          {roadmaps.map((rm, idx) => {
            const date = lastUpdated(rm);
            return (
              <div
                key={rm.id}
                className="card-fade-in flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <p className="text-sm text-[#f5f0eb] font-medium leading-snug">{rm.title || rm.topic}</p>
                {date ? (
                  <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#2c2828] bg-[#1e1c1c] px-3 py-1 text-xs text-[#9e9792]">
                    {date}
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-[#3a3535]">—</span>
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
            Autonomous agents that run in the background — spotting trends, scanning your content, and making sure every roadmap stays relevant.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* mb-10 spacer replaced by the header above */}

      {/* Agent selector */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {AGENTS.map((agent) => {
          const isActive = activeAgent === agent.id;
          const bg = agent.id === 'trends'
            ? 'bg-gradient-to-b from-[#0c2340] via-[#0e2d50] to-[#070f1a]'
            : 'bg-gradient-to-b from-[#0a2a20] via-[#0d3528] to-[#060f0a]';
          const glowColor = agent.id === 'trends'
            ? 'rgba(34,211,238,0.18)' : 'rgba(52,211,153,0.18)';
          const glowGradient = agent.id === 'trends' ? '#22d3ee' : '#34d399';
          return (
            <div
              key={agent.id}
              role="button"
              tabIndex={agent.live ? 0 : -1}
              onClick={() => agent.live && setActiveAgent(agent.id)}
              onKeyDown={(e) => e.key === 'Enter' && agent.live && setActiveAgent(agent.id)}
              style={{ cursor: agent.live ? 'pointer' : 'default', opacity: agent.live ? 1 : 0.5 }}
              className={isActive ? 'glow-active rounded-xl' : ''}
            >
              <ThreeDLayeredCard
                logo="/ss-logo.svg"
                mainImage="/img-agent.svg"
                title={agent.name}
                width="100%"
                height={{ collapsed: 150, expanded: 300 }}
                logoSize={52}
                logoPosition={{ expanded: 12 }}
                titlePosition={100}
                backgroundColor={bg}
                glowColor={glowColor}
                glowGradient={glowGradient}
                shineIntensity={0.25}
                textColor="white"
              >
                <div className="flex flex-col items-center gap-2 w-full px-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
                    agent.live
                      ? 'border-emerald-800/40 bg-emerald-950/50 text-emerald-400'
                      : 'border-white/10 bg-white/5 text-white/30'
                  }`}>
                    {agent.live ? '● Live' : 'Coming soon'}
                  </span>
                  <p className="text-[11px] text-white/60 text-center leading-relaxed line-clamp-2">
                    {agent.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {agent.poweredBy.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-white/40">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </ThreeDLayeredCard>
            </div>
          );
        })}
      </div>

      {/* Active agent output */}
      {activeAgent === 'content' && (
        <div className="gradient-border rounded-2xl">
          <div className="rounded-2xl bg-[#161414] p-5 sm:p-8">
            <div className="flex items-start gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#f5f0eb]">Content Lifecycle Agent</h2>
                  <span className="flex items-center gap-1 rounded-full border border-emerald-800/40 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Running
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#9e9792] max-w-lg">{AGENTS[1].description}</p>
              </div>
            </div>
            <ContentLifecyclePanel />
          </div>
        </div>
      )}

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
            <ChaptersList />
          </div>
        </div>
      )}
      </div>{/* /inner content wrapper */}
    </div>
  );
}
