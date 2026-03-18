import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agents',
  description:
    'Autonomous AI agents running in the background — Trend Discovery spots what the tech world is learning now, Content Lifecycle keeps your library from going stale.',
  alternates: { canonical: '/agents' },
  openGraph: {
    title: 'AI Agents | SkillStream AI',
    description:
      'Meet the autonomous agents powering SkillStream AI — built on Amazon Bedrock Strands, running 24/7 to keep your learning library fresh.',
    url: '/agents',
  },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
