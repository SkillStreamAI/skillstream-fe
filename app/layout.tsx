import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { RTL_LOCALES } from '@/i18n/routing';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skillstream.ai';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SkillStream AI — Audio Learning Roadmaps',
    template: '%s | SkillStream AI',
  },
  description:
    'Turn any tech topic into a structured audio course. AI-generated roadmaps narrated by Amazon Polly — learn Kubernetes, Rust, LLM Engineering, and more on the go.',
  openGraph: {
    type: 'website',
    siteName: 'SkillStream AI',
    title: 'SkillStream AI — Audio Learning Roadmaps',
    description:
      'Turn any tech topic into a structured audio course. AI-generated roadmaps narrated by Amazon Polly — learn on the go.',
    url: BASE_URL,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SkillStream AI — Audio Learning Roadmaps',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#org`,
      name: 'SkillStream AI',
      url: BASE_URL,
      logo: `${BASE_URL}/ss-logo.svg`,
      description:
        'AI-powered audio learning platform that generates structured roadmaps and podcast episodes for any technology topic.',
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'SkillStream AI',
      publisher: { '@id': `${BASE_URL}/#org` },
    },
    {
      '@type': 'WebApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'SkillStream AI',
      url: BASE_URL,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description:
        'Generate hierarchical audio learning roadmaps for any tech topic using Amazon Bedrock and Amazon Polly.',
      publisher: { '@id': `${BASE_URL}/#org` },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations('nav');
  const dir = RTL_LOCALES.has(locale as 'he') ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* FOUC prevention — reads localStorage before React hydrates so the
            correct data-theme is set on <html> before any paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('skillstream_theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${gaId}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded-lg focus:bg-[#e8a020] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          {t('skipToMain')}
        </a>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <AuthProvider>
              {gaId && <GoogleAnalytics measurementId={gaId} />}
              <Navbar />
              {/* pt-16 offsets the fixed 64px navbar; pb-20 reserves space for MiniPlayer when active */}
              <main id="main-content" className="pt-16 pb-20">{children}</main>
              <Footer />
              <MiniPlayer />
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
