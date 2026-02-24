import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  {
    icon: '🗺️',
    title: 'AI-Generated Roadmaps',
    desc: 'Enter any tech topic and receive a structured, level-progressive learning path in seconds.',
  },
  {
    icon: '🎙️',
    title: 'Podcast Episodes',
    desc: 'Each roadmap node is paired with a curated audio episode you can listen to on the go.',
  },
  {
    icon: '🤖',
    title: 'Agentic & Self-Evolving',
    desc: 'Trend Discovery and Content Lifecycle agents keep your library fresh without manual effort.',
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    desc: 'Mark episodes complete, save roadmaps, and watch your expertise grow over time.',
  },
  {
    icon: '⚡',
    title: 'Built on AWS',
    desc: 'Powered by Amazon Bedrock, Polly, Step Functions, and DynamoDB for scale and reliability.',
  },
  {
    icon: '🎧',
    title: 'Learn Anywhere',
    desc: 'Convert your commute, gym session, or any dead time into productive learning windows.',
  },
];

const STEPS = [
  { step: '01', title: 'Enter a Topic', desc: 'Type any technology — DevOps, AI Engineering, Kubernetes, etc.' },
  { step: '02', title: 'Get Your Roadmap', desc: 'Amazon Bedrock generates a hierarchical syllabus ordered from foundations to expert level.' },
  { step: '03', title: 'Listen & Learn', desc: 'Amazon Polly narrates each module as a crisp 5–10 minute podcast episode.' },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-gradient relative flex min-h-[90vh] flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
            Powered by AWS Bedrock &amp; Amazon Polly
          </div>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl">
            Learn Smarter,
            <br />
            <span className="gradient-text">Stream Faster</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 sm:text-xl">
            SkillStream AI turns technical goals into hierarchical audio roadmaps.
            No more analysis paralysis — just clear, ordered episodes that fit into your day.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/generator">
              <Button size="lg">Start Learning Free</Button>
            </Link>
            <Link href="/player">
              <Button size="lg" variant="outline">
                Browse Episodes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-white sm:mb-12 sm:text-3xl">
          How It Works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7c3aed,#2563eb)] text-sm font-bold text-white">
                {step}
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:pb-24 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-white sm:mb-12 sm:text-3xl">
          Everything you need to level up
        </h2>
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="gradient-border rounded-xl">
              <div className="rounded-xl bg-[#111] p-5 sm:p-7">
                <div className="mb-4 text-3xl">{f.icon}</div>
                <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#a1a1aa]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 text-center px-4">
        <div className="gradient-border rounded-2xl mx-auto max-w-2xl">
          <div className="rounded-2xl bg-[#111] px-5 py-10 sm:px-8 sm:py-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to build your roadmap?
            </h2>
            <p className="mt-3 text-[#a1a1aa]">
              Free to use. Backed by AWS. Always evolving.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/generator">
                <Button size="lg">Generate My Roadmap</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="ghost">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
