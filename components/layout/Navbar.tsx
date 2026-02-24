'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';

const NAV_LINKS = [
  { href: '/roadmaps',  label: 'Roadmaps'  },
  { href: '/generator', label: 'Generate'  },
  { href: '/player',    label: 'Podcast'   },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
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
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? 'text-white'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side: auth + hamburger */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-[#a1a1aa] sm:block">
                {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => router.push('/login')}>
              Sign in
            </Button>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex md:hidden flex-col justify-center items-center w-8 h-8 gap-1.5 rounded focus:outline-none"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white transition-all duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="border-t border-[#2a2a2a] bg-black/95 px-4 py-3 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm font-medium transition-colors border-b border-[#1a1a1a] last:border-0 ${
                pathname.startsWith(href)
                  ? 'text-white'
                  : 'text-[#a1a1aa]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
