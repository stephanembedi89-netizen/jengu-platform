import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/lib/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  // Correspondre à tout sauf fichiers statiques et routes API
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
