import { analyticsProvider } from '#analytics-provider';
import { noticeVersion } from './record';

// Missing information must never produce a usable analytics opt-in.
function completeProvider() {
  const provider = analyticsProvider;
  if (!provider || !provider.id?.trim() || !provider.revision?.trim() || typeof provider.createAdapter !== 'function') return null;
  for (const locale of ['ro', 'en'] as const) {
    const disclosure = provider.disclosure?.[locale];
    if (!disclosure || ['name', 'purpose', 'data', 'retention'].some((key) => {
      const value = disclosure[key as keyof typeof disclosure];
      return typeof value !== 'string' || !value.trim();
    })) return null;
  }
  return provider;
}

export const provider = completeProvider();
// Bump the notice or provider revision whenever disclosure, purpose or technology changes.
export const consentVersion = `${noticeVersion}:${provider ? `${provider.id}:${provider.revision}` : 'none'}`;
