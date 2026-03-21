import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for SkillStream AI — how we handle your data, what we collect, and what we do not store.',
  alternates: { canonical: '/privacy' },
};

const EFFECTIVE_DATE = 'March 2025';

function Section({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <div className="glass-panel p-6 sm:p-8">
      <h2 className="mb-3 text-base font-bold text-[var(--text-1)]">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-[var(--text-2)]">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <div className="hero-gradient border-b border-[var(--border)] px-4 pt-20 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--amber)]">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-1)] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-[var(--text-2)]">
            Effective date: {EFFECTIVE_DATE}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

        <Section title="Overview">
          <p>
            SkillStream AI (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy explains what information we collect when you use SkillStream AI, how we use it, and what we do not do with it.
          </p>
          <p>
            By using SkillStream AI, you agree to the practices described in this policy.
          </p>
        </Section>

        <Section title="Information we collect">
          <p><strong className="text-[var(--text-1)]">Analytics data</strong> — If Google Analytics is enabled on your deployment, we collect anonymised page views, session durations, and interaction events via Google Analytics 4. No personally identifiable information is included in these events.</p>
          <p><strong className="text-[var(--text-1)]">Local preferences</strong> — We store the following data in your browser&apos;s <code className="rounded bg-[var(--surface-2)] px-1 text-xs">localStorage</code> on your device only:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><code className="rounded bg-[var(--surface-2)] px-1 text-xs">skillstream_user</code> — your display name and email from the sign-in form (mock auth, never sent to a server)</li>
            <li><code className="rounded bg-[var(--surface-2)] px-1 text-xs">skillstream_theme</code> — your light/dark/system theme preference</li>
            <li><code className="rounded bg-[var(--surface-2)] px-1 text-xs">skillstream_a11y</code> — your accessibility preferences (font size, reduced motion, high contrast)</li>
          </ul>
          <p>This data never leaves your device and is not transmitted to our servers.</p>
        </Section>

        <Section title="What we do not collect">
          <ul className="ml-4 list-disc space-y-1">
            <li>Passwords — the current authentication system is a local mock; no credentials are sent to or stored on any server.</li>
            <li>Payment information — SkillStream AI does not process payments.</li>
            <li>Location data — we do not request or store your geographic location.</li>
            <li>Device fingerprints or cross-site tracking identifiers.</li>
          </ul>
        </Section>

        <Section title="Third-party services">
          <p><strong className="text-[var(--text-1)]">Amazon Web Services (AWS)</strong> — Audio files are served from Amazon S3. Roadmap and episode data is fetched from AWS Lambda. AWS infrastructure is subject to the <a href="https://aws.amazon.com/privacy/" className="underline hover:text-[var(--text-1)]" target="_blank" rel="noopener noreferrer">AWS Privacy Notice</a>.</p>
          <p><strong className="text-[var(--text-1)]">Google Analytics</strong> — If a GA Measurement ID is configured, Google Analytics 4 collects anonymised usage data. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" className="underline hover:text-[var(--text-1)]" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</p>
          <p><strong className="text-[var(--text-1)]">Google Fonts</strong> — We use Geist font loaded via next/font, which downloads and self-hosts the font at build time. No runtime requests are made to Google servers.</p>
        </Section>

        <Section title="Cookies">
          <p>SkillStream AI does not set any first-party cookies. Google Analytics may set cookies if enabled — see <a href="https://policies.google.com/privacy" className="underline hover:text-[var(--text-1)]" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a> for details.</p>
        </Section>

        <Section title="Data retention">
          <p>
            All local preferences stored in <code className="rounded bg-[var(--surface-2)] px-1 text-xs">localStorage</code> remain on your device until you clear your browser data. You can remove them at any time via your browser&apos;s developer tools or by clearing site data.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. Changes take effect when published at this URL. Continued use of SkillStream AI after changes constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have questions about this policy or how your data is handled, please open an issue in the project&apos;s GitHub repository.
          </p>
        </Section>

      </div>
    </div>
  );
}
