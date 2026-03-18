import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Player',
  description:
    'Listen to AI-generated audio courses. Pick a roadmap and play narrated episodes — structured learning for any technology topic, anywhere.',
  alternates: { canonical: '/player' },
  openGraph: {
    title: 'Player | SkillStream AI',
    description:
      'Listen to AI-narrated podcast episodes for any tech roadmap — learn on your commute or at the gym.',
    url: '/player',
  },
};

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
