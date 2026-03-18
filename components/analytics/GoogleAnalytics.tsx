'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  // eslint-disable-next-line no-var
  var gtag: (command: string, ...args: unknown[]) => void;
}

/**
 * Fires a GA4 page_view on every client-side route change.
 * Rendered only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  // Script tags are injected in layout.tsx via next/script — nothing to render here.
  return null;
}
