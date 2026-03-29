'use client';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-3)]">
      <p>{t('copyright', { year: new Date().getFullYear() })}</p>
    </footer>
  );
}
