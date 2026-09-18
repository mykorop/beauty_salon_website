export const storageKey = 'bookme.cookie-consent';
export const lifetime = 180 * 24 * 60 * 60 * 1000;
export const noticeVersion = '2026-09-18';
export type Choice = 'acknowledged' | 'allowed' | 'denied';
export interface ConsentRecord {
  schemaVersion: 1;
  noticeVersion: string;
  choice: Choice;
  actedAt: number;
  expiresAt: number;
}

// Browser storage is untrusted. Fail closed without extending an existing term.
export function readChoice(version: string, hasAnalytics: boolean): ConsentRecord | null {
  const raw = localStorage.getItem(storageKey);
  if (raw === null) return null;
  let record: ConsentRecord | undefined;
  try { record = JSON.parse(raw); } catch { /* Invalid records are removed below. */ }
  const now = Date.now();
  if (record && record.schemaVersion === 1 && record.noticeVersion === version
    && (hasAnalytics ? record.choice === 'allowed' || record.choice === 'denied' : record.choice === 'acknowledged')
    && Number.isSafeInteger(record.actedAt) && Number.isSafeInteger(record.expiresAt)
    && record.actedAt <= now && record.actedAt >= 0 && record.expiresAt > now
    && record.expiresAt - record.actedAt === lifetime) return record;
  localStorage.removeItem(storageKey);
  return null;
}
