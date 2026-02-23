'use client';
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 h-16">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="gradient-text text-xl font-bold tracking-tight">
            SkillStream AI
          </span>
        </Link>

        {/* Nav links */}
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

        {/* Auth */}
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
        </div>
      </div>
    </nav>
  );
}
