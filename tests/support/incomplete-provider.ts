import { analyticsProvider as complete } from './analytics-provider';

export const analyticsProvider = {
  ...complete,
  disclosure: { ...complete.disclosure, en: { ...complete.disclosure.en, retention: '' } },
};
