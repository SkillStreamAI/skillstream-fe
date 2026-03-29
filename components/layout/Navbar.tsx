'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme, type Theme } from '@/lib/theme-context';
import { useTranslations, useLocale } from 'next-intl';
import { locales, type Locale } from '@/i18n/routing';

/* ── Theme toggle icons ─────────────────────────────────────── */
function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

const THEME_OPTIONS: { value: Theme; labelKey: 'light' | 'system' | 'dark'; Icon: () => React.JSX.Element }[] = [
  { value: 'light',  labelKey: 'light',  Icon: SunIcon   },
  { value: 'system', labelKey: 'system', Icon: SystemIcon },
  { value: 'dark',   labelKey: 'dark',   Icon: MoonIcon  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('theme');
  const tNav = useTranslations('nav');

  return (
    <div
      className="flex items-center rounded-full border p-0.5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
      role="group"
      aria-label={tNav('chooseTheme')}
    >
      {THEME_OPTIONS.map(({ value, labelKey, Icon }) => {
        const isActive = theme === value;
        const label = t(labelKey);
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={`${label} theme`}
            aria-pressed={isActive}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200"
            style={{
              background:  isActive ? 'var(--amber)'  : 'transparent',
              color:       isActive ? '#000'           : 'var(--text-2)',
            }}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'he', label: 'HE' },
];

function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const router = useRouter();

  const switchLocale = (next: Locale) => {
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  };

  return (
    <div
      className="flex items-center rounded-full border p-0.5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
      role="group"
      aria-label={t('chooseLanguage')}
    >
      {LOCALE_OPTIONS.map(({ value, label }) => {
        const isActive = locale === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => switchLocale(value)}
            aria-pressed={isActive}
            className="flex h-7 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200"
            style={{
              background: isActive ? 'var(--amber)' : 'transparent',
              color:      isActive ? '#000'         : 'var(--text-2)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('nav');

  const NAV_LINKS = [
    { href: '/roadmaps', label: t('roadmaps') },
    { href: '/agents',   label: t('agents')   },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 select-none" onClick={() => setMenuOpen(false)}>
          <span className="gradient-text text-xl font-bold tracking-tight">
            {t('brand')}
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar-links hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-colors"
              style={{ color: pathname.startsWith(href) ? 'var(--text-1)' : 'var(--text-2)' }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side: language switcher + theme toggle + hamburger */}
        <div className="flex items-center gap-3">
          {/* Theme toggle — always visible */}
          <ThemeToggle />
          {/* Language switcher — always visible */}
          <LanguageSwitcher />

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex md:hidden flex-col justify-center items-center w-8 h-8 gap-1.5 rounded focus:outline-none"
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
          >
            <span
              className={`block h-0.5 w-5 transition-all duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
              style={{ background: 'var(--text-1)' }}
            />
            <span
              className={`block h-0.5 w-5 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}
              style={{ background: 'var(--text-1)' }}
            />
            <span
              className={`block h-0.5 w-5 transition-all duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              style={{ background: 'var(--text-1)' }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="border-t px-4 py-3 md:hidden"
          style={{ borderColor: 'var(--border)', background: 'var(--mobile-menu-bg)' }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium transition-colors border-b last:border-0"
              style={{
                borderColor: 'var(--border-subtle)',
                color: pathname.startsWith(href) ? 'var(--text-1)' : 'var(--text-2)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
