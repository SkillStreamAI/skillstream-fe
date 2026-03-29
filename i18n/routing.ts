export const locales = ['en', 'he'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const RTL_LOCALES = new Set<Locale>(['he']);
