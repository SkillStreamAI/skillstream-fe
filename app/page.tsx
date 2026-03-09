import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

const FEATURES = [
  { icon: '🗺️', title: 'AI-Generated Roadmaps',    desc: 'Enter any tech topic and receive a structured, level-progressive learning path in seconds.' },
  { icon: '🎙️', title: 'Podcast Episodes',          desc: 'Each roadmap node is paired with a curated audio episode you can listen to on the go.' },
  { icon: '🤖', title: 'Agentic & Self-Evolving',   desc: 'Trend Discovery and Content Lifecycle agents keep your library fresh without manual effort.' },
  { icon: '📈', title: 'Progress Tracking',         desc: 'Mark episodes complete, save roadmaps, and watch your expertise grow over time.' },
  { icon: '⚡', title: 'Built on AWS',              desc: 'Powered by Amazon Bedrock, Polly, Step Functions, and DynamoDB for scale and reliability.' },
  { icon: '🎧', title: 'Learn Anywhere',            desc: 'Convert your commute, gym session, or any dead time into productive learning windows.' },
];

const STEPS = [
  { step: '01', title: 'Browse Roadmaps',  desc: 'Explore AI-generated learning paths across any technology domain.' },
  { step: '02', title: 'Get Your Roadmap', desc: 'Amazon Bedrock generates a hierarchical syllabus ordered from foundations to expert level.' },
  { step: '03', title: 'Listen & Learn',   desc: 'Amazon Polly narrates each module as a crisp 5–10 minute podcast episode.' },
];

const TOPICS = [
  'Kubernetes', 'Rust', 'LLM Engineering', 'AWS CDK', 'DevSecOps',
  'TypeScript', 'Terraform', 'Prompt Engineering', 'GraphQL', 'Observability',
  'WebAssembly', 'Distributed Systems', 'MLOps', 'Edge Computing', 'Zero Trust',
];

export default function LandingPage() {
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2c2828] bg-[#161414] px-4 py-1.5 text-xs font-medium text-[#9e9792]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8a020]" />
            Powered by AWS Bedrock &amp; Amazon Polly
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-[#f5f0eb] sm:text-6xl lg:text-7xl">
            Learn Smarter,
            <br />
            <span className="gradient-text">Stream Faster</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-[#9e9792] sm:text-lg">
            SkillStream AI turns any tech topic into a structured audio roadmap.
            Clear, ordered episodes that fit into your day.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/roadmaps">
              <Button size="lg">Browse Roadmaps</Button>
            </Link>
            <Link href="/player">
              <Button size="lg" variant="outline">Open Player</Button>
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0d0c0c] to-transparent" />
      </section>

      {/* ── Trending topics ticker ────────────────────────── */}
      <section className="border-y border-[#2c2828] bg-[#0d0c0c] py-5">
        <div className="relative">
          <InfiniteSlider gap={12} duration={35} speedOnHover={70}>
            {TOPICS.map((topic) => (
              <span
                key={topic}
                className="shrink-0 rounded-full border border-[#2c2828] bg-[#161414] px-4 py-1.5 text-xs font-medium text-[#9e9792]"
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
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-[#e8a020]">How it works</p>
        <h2 className="mb-12 text-center text-2xl font-bold text-[#f5f0eb] sm:text-3xl">
          From topic to podcast in minutes
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1e1c1c] border border-[#2c2828] text-sm font-bold text-[#e8a020]">
                {step}
              </div>
              <h3 className="text-base font-semibold text-[#f5f0eb]">{title}</h3>
              <p className="text-sm text-[#9e9792] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-[#2c2828]" />
      </div>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:py-28 sm:px-6 lg:px-8">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-[#e8a020]">Features</p>
        <h2 className="mb-12 text-center text-2xl font-bold text-[#f5f0eb] sm:text-3xl">
          Everything you need to level up
        </h2>
        <div className="grid gap-px bg-[#2c2828] rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-[#0d0c0c] p-6 hover:bg-[#161414] transition-colors">
              <div className="mb-4 text-2xl">{f.icon}</div>
              <h3 className="mb-2 text-sm font-semibold text-[#f5f0eb]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#9e9792]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
