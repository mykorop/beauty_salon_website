import { homeContent } from './home';
import type { Locale } from '../i18n';

export const webAppUrl = 'https://app.bookme.md/';

// Shared by the visible downloads and structured data; product evidence is in docs/seo.md.
export function getApps(locale: Locale) {
  const text = homeContent[locale].downloads;
  return [
    {
      id: 'client', name: 'BookMe', audience: text.clientAudience, description: text.clientDescription,
      applicationCategory: 'LifestyleApplication',
      android: 'https://play.google.com/store/apps/details?id=md.bookme.client',
      ios: 'https://apps.apple.com/us/app/bookme/id6779576243',
    },
    {
      id: 'business', name: 'BookMe Business', alternateName: 'BookMe Salon',
      audience: text.businessAudience, description: text.businessDescription,
      applicationCategory: 'BusinessApplication',
      android: 'https://play.google.com/store/apps/details?id=md.bookme.business',
      ios: 'https://apps.apple.com/ua/app/bookme-salon/id6779576340?l=uk',
    },
  ] as const;
}
