import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Roadmaps',
  description:
    'Browse AI-generated learning roadmaps across any technology domain. Each roadmap contains structured episodes ordered from foundational to expert level.',
  alternates: { canonical: '/roadmaps' },
  openGraph: {
    title: 'Learning Roadmaps | SkillStream AI',
    description:
      'AI-generated learning paths for Kubernetes, Rust, LLM Engineering, and more — narrated as podcast episodes.',
    url: '/roadmaps',
  },
};

export default function RoadmapsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
