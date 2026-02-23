'use client';
import { useState } from 'react';
import { TopicInput } from '@/components/roadmap/TopicInput';
import { RoadmapGrid } from '@/components/roadmap/RoadmapGrid';
import { generateRoadmap } from '@/lib/lambda';
import type { RoadmapNode } from '@/lib/types';

// Shown when Lambda URL is not yet configured
const MOCK_NODES: RoadmapNode[] = [
  {
    id: 'f1',
    title: 'Core Concepts & Mental Models',
    description: 'Essential theory and terminology you need before diving deeper into the subject.',
    level: 'foundational',
    durationMin: 15,
  },
  {
    id: 'f2',
    title: 'Setting Up Your Environment',
    description: 'Tooling, configuration, and local development best practices to hit the ground running.',
    level: 'foundational',
    durationMin: 20,
  },
  {
    id: 'i1',
    title: 'Building Your First Project',
    description: 'Hands-on mini project applying everything from the foundational modules.',
    level: 'intermediate',
    durationMin: 35,
    audioUrl: '#',
  },
  {
    id: 'i2',
    title: 'Testing & Debugging',
    description: 'Strategies for writing reliable tests and diagnosing issues efficiently.',
    level: 'intermediate',
    durationMin: 25,
    audioUrl: '#',
  },
  {
    id: 'a1',
    title: 'Advanced Patterns & Architecture',
    description: 'Design patterns, performance considerations, and architectural decisions used in production.',
    level: 'advanced',
    durationMin: 45,
    audioUrl: '#',
  },
  {
    id: 'e1',
    title: 'Production & Scaling',
    description: 'Deploy, monitor, and scale your solution to handle real-world traffic and edge cases.',
    level: 'expert',
    durationMin: 60,
    audioUrl: '#',
  },
];

export default function GeneratorPage() {
  const [nodes, setNodes]     = useState<RoadmapNode[] | null>(null);
  const [title, setTitle]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleGenerate = async (topic: string) => {
    setLoading(true);
    setError('');
    setNodes(null);
    try {
      const result = await generateRoadmap(topic);
      setTitle(result.title);
      setNodes(result.nodes);
    } catch (err) {
      // Fall back to mock data when Lambda URL is not configured
      console.warn('Lambda unavailable, using mock data:', err);
      setTitle(`${topic} — Learning Roadmap`);
      setNodes(MOCK_NODES);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Generate a{' '}
          <span className="gradient-text">Learning Roadmap</span>
        </h1>
        <p className="mt-2 text-[#a1a1aa]">
          Enter any technology or skill — we'll map your learning path from foundations to expert.
        </p>
      </div>

      <TopicInput onSubmit={handleGenerate} loading={loading} />

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl bg-red-950/40 px-4 py-3 text-sm text-red-400 border border-red-900/40">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-20 flex flex-col items-center gap-4 text-[#a1a1aa]">
          <div
            className="h-10 w-10 rounded-full border-4 border-[#2a2a2a] border-t-[#7c3aed]"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
          <p className="text-sm">Building your roadmap with Amazon Bedrock…</p>
        </div>
      )}

      {/* Results */}
      {nodes && !loading && (
        <div className="mt-12">
          <div className="mb-8 flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-sm text-[#52525b]">
              {nodes.length} module{nodes.length !== 1 ? 's' : ''} across{' '}
              {[...new Set(nodes.map((n) => n.level))].length} levels
            </p>
          </div>
          <RoadmapGrid nodes={nodes} />
        </div>
      )}
    </div>
  );
}
