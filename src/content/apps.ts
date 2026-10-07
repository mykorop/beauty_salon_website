import { homeContent } from './home';
import type { Locale } from '../i18n';

// Each app's web version. Exact addresses: no language parameters, deep links or redirects.
export const webAppUrls = {
  client: 'https://app.bookme.md/',
  business: 'https://business.bookme.md/',
} as const;

// Shared by the visible downloads, web links and structured data; product evidence is in docs/seo.md.
export function getApps(locale: Locale) {
  const text = homeContent[locale].downloads;
  return [
    {
      id: 'client', name: 'BookMe', audience: text.clientAudience, description: text.clientDescription,
      applicationCategory: 'LifestyleApplication', webUrl: webAppUrls.client,
      android: 'https://play.google.com/store/apps/details?id=md.bookme.client',
      ios: 'https://apps.apple.com/us/app/bookme/id6779576243',
    },
    {
      id: 'business', name: 'BookMe Business', alternateName: 'BookMe Salon',
      audience: text.businessAudience, description: text.businessDescription,
      applicationCategory: 'BusinessApplication', webUrl: webAppUrls.business,
      android: 'https://play.google.com/store/apps/details?id=md.bookme.business',
      ios: 'https://apps.apple.com/ua/app/bookme-salon/id6779576340?l=uk',
    },
  ] as const;
}
