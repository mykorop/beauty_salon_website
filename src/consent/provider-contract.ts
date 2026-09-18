import type { Locale } from '../i18n';

export interface CollectionPermission {
  signal: AbortSignal;
  // Check before every request, write or async continuation; never queue before consent.
  mayCollect: () => boolean;
}

export interface AnalyticsAdapter {
  start(permission: CollectionPermission): void | Promise<void>;
  stop(): void;
  clear(): void;
}

export interface AnalyticsProvider {
  id: string;
  revision: string;
  disclosure: Record<Locale, { name: string; purpose: string; data: string; retention: string }>;
  // Imports and construction must be inert. Only start may load a SDK or collect data.
  createAdapter(): AnalyticsAdapter;
}
