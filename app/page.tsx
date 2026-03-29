import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'SkillStream AI — Audio Learning Roadmaps',
  description:
    'Turn any tech topic into a structured audio course. AI-generated roadmaps narrated by Amazon Polly — learn Kubernetes, Rust, LLM Engineering, and more on the go.',
  alternates: { canonical: '/' },
};
import { Button } from '@/components/ui/Button';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

const TOPICS = [
  'Kubernetes', 'Rust', 'LLM Engineering', 'AWS CDK', 'DevSecOps',
  'TypeScript', 'Terraform', 'Prompt Engineering', 'GraphQL', 'Observability',
  'WebAssembly', 'Distributed Systems', 'MLOps', 'Edge Computing', 'Zero Trust',
];

export default async function LandingPage() {
  const t = await getTranslations('landing');

  const FEATURES = [
    { icon: '🗺️', title: t('aiRoadmapsFeatureTitle'), desc: t('aiRoadmapsFeatureDescription') },
    { icon: '🎙️', title: t('podcastFeatureTitle'), desc: t('podcastFeatureDescription') },
    { icon: '🤖', title: t('agenticFeatureTitle'), desc: t('agenticFeatureDescription') },
    { icon: '📈', title: t('progressFeatureTitle'), desc: t('progressFeatureDescription') },
    { icon: '⚡', title: t('awsFeatureTitle'), desc: t('awsFeatureDescription') },
    { icon: '🎧', title: t('mobileFeatureTitle'), desc: t('mobileFeatureDescription') },
  ];

  const STEPS = [
    { step: '01', title: t('step1Title'), desc: t('step1Description') },
    { step: '02', title: t('step2Title'), desc: t('step2Description') },
    { step: '03', title: t('step3Title'), desc: t('step3Description') },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-gradient relative flex min-h-[92vh] flex-col items-center justify-center px-4 text-center">
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
          }}
        />

        <div className="relative z-10 max-w-4xl">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--text-2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8a020]" />
            {t('poweredByBadge')}
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-[var(--text-1)] sm:text-6xl lg:text-7xl">
            {t('heroTitleMain')}
            <br />
            <span className="gradient-text">{t('heroTitleHighlight')}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-[var(--text-2)] sm:text-lg">
            {t('heroDescription')}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/roadmaps">
              <Button size="lg">{t('heroBrowseButton')}</Button>
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </section>

      {/* ── Trending topics ticker ────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--background)] py-5">
        <div className="relative">
          <InfiniteSlider gap={12} duration={35} speedOnHover={70}>
            {TOPICS.map((topic) => (
              <span
                key={topic}
                className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--text-2)]"
              >
                {topic}
              </span>
            ))}
          </InfiniteSlider>
          <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-24" direction="left"  blurIntensity={0.6} />
          <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-24" direction="right" blurIntensity={0.6} />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:py-28 sm:px-6 lg:px-8">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-[#e8a020]">{t('howItWorksSectionTag')}</p>
        <h2 className="mb-12 text-center text-2xl font-bold text-[var(--text-1)] sm:text-3xl">
          {t('howItWorksSectionTitle')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="glass-panel flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8a020]/30 bg-[#e8a020]/10 text-sm font-bold text-[#e8a020]">
                {step}
              </div>
              <h3 className="text-base font-semibold text-[var(--text-1)]">{title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-2)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-[var(--border)]" />
      </div>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:py-28 sm:px-6 lg:px-8">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-[#e8a020]">{t('featuresSectionTag')}</p>
        <h2 className="mb-12 text-center text-2xl font-bold text-[var(--text-1)] sm:text-3xl">
          {t('featuresSectionTitle')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-panel p-6">
              <div className="mb-4 text-2xl">{f.icon}</div>
              <h3 className="mb-2 text-sm font-semibold text-[var(--text-1)]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-2)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
