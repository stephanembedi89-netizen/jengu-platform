import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Attendre la locale depuis la requête
  let locale = await requestLocale;

  // Valider que la locale est supportée
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  const messages = (await import(`./${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
