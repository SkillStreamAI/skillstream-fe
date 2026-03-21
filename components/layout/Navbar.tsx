'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme, type Theme } from '@/lib/theme-context';

const NAV_LINKS = [
  { href: '/roadmaps', label: 'Roadmaps' },
  { href: '/agents',   label: 'Agents'   },
];

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

const THEME_OPTIONS: { value: Theme; label: string; Icon: () => React.JSX.Element }[] = [
  { value: 'light',  label: 'Light',  Icon: SunIcon   },
  { value: 'system', label: 'System', Icon: SystemIcon },
  { value: 'dark',   label: 'Dark',   Icon: MoonIcon  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center rounded-full border p-0.5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
      role="group"
      aria-label="Choose theme"
    >
      {THEME_OPTIONS.map(({ value, label, Icon }) => {
        const isActive = theme === value;
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

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
            SkillStream AI
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 md:flex">
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

        {/* Right side: theme toggle + hamburger */}
        <div className="flex items-center gap-3">
          {/* Theme toggle — always visible */}
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex md:hidden flex-col justify-center items-center w-8 h-8 gap-1.5 rounded focus:outline-none"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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
