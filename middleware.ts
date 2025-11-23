import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: 'th',

  // Locale prefix strategy
  localePrefix: 'always' // Always include locale in URL (/th/products, /en/products)
});

export const config = {
  // Match only internationalized pathnames
  // Exclude admin, api, _next, and static files
  matcher: ['/', '/(th|en)/:path*', '/((?!api|_next|_vercel|admin|.*\\..*).*)']
};
