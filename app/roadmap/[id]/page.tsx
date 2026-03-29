import { getTranslations } from 'next-intl/server';

interface PageProps {
  readonly params: Promise<{ id: string }>;
}

// Next.js 16: params is a Promise in async Server Components
export default async function RoadmapDetailPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations('roadmaps');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#52525b]">
          {t('singlePageBreadcrumb')} · {id}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#f5f0eb]">
          {t('singlePageTitle')} <span className="gradient-text">{t('singlePageTitleHighlight')}</span>
        </h1>
        <p className="mt-2 text-[#9e9792]">
          {t('singlePageDescription')}
        </p>
      </div>

      <div className="glass-panel p-6 text-center">
        <p className="text-sm text-[#9e9792]">{t('singlePageComingSoon')}</p>
        <p className="mt-1 text-xs text-[#5a5450]">
          {t('singlePageBrowseHint')}{' '}
          <a href="/roadmaps" className="text-[#e8a020] hover:underline">{t('singlePageBrowseLink')}</a>.
        </p>
      </div>
    </div>
  );
}
