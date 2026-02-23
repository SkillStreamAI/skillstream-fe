import { RoadmapGrid } from '@/components/roadmap/RoadmapGrid';
import type { RoadmapNode } from '@/lib/types';

// Placeholder nodes — replace with a Lambda fetch by ID once the endpoint is ready
const PLACEHOLDER_NODES: RoadmapNode[] = [
  {
    id: 'f1',
    title: 'Core Fundamentals',
    description: 'Essential theory and terminology to build a solid mental model.',
    level: 'foundational',
    durationMin: 20,
  },
  {
    id: 'f2',
    title: 'Practical Basics',
    description: 'First hands-on exercises applying the core concepts.',
    level: 'foundational',
    durationMin: 25,
    audioUrl: '#',
  },
  {
    id: 'i1',
    title: 'Intermediate Concepts',
    description: 'Building on the fundamentals with real-world patterns.',
    level: 'intermediate',
    durationMin: 30,
    audioUrl: '#',
  },
  {
    id: 'a1',
    title: 'Advanced Techniques',
    description: 'Professional-level patterns and best practices.',
    level: 'advanced',
    durationMin: 45,
    audioUrl: '#',
  },
  {
    id: 'e1',
    title: 'Expert Architecture',
    description: 'System design, deep mastery, and production considerations.',
    level: 'expert',
    durationMin: 60,
    audioUrl: '#',
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

// Next.js 16: params is a Promise in async Server Components
export default async function RoadmapDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-[#52525b]">
          Roadmap · {id}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Your <span className="gradient-text">Learning Path</span>
        </h1>
        <p className="mt-2 text-[#a1a1aa]">
          Work through each module in order — foundations before advanced concepts.
        </p>
      </div>

      <RoadmapGrid nodes={PLACEHOLDER_NODES} />
    </div>
  );
}
