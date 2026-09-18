import type { AnalyticsProvider } from '../../src/consent/provider-contract';

// Build-time alias only. Nothing in this module belongs in the published artifact.
export const analyticsProvider: AnalyticsProvider = {
  id: 'controlled-test-provider', revision: '1',
  disclosure: {
    en: { name: 'Controlled test analytics', purpose: 'Verify consent in browser tests.', data: 'Synthetic page events; test SDK resource; localStorage bookme.test-analytics, sessionStorage bookme.test-session and cookie bookme_test_analytics (host-only, Path=/, SameSite=Lax). No visitor ID.', retention: 'Local data: 180 days at most, cleared on withdrawal. Intercepted events: not retained by a server.' },
    ro: { name: 'Analiză controlată de test', purpose: 'Verificarea consimțământului în teste de browser.', data: 'Evenimente sintetice; resursă SDK de test; localStorage bookme.test-analytics, sessionStorage bookme.test-session și cookie bookme_test_analytics (doar gazda curentă, Path=/, SameSite=Lax). Fără ID de vizitator.', retention: 'Date locale: cel mult 180 de zile, șterse la retragere. Evenimente interceptate: fără păstrare pe server.' },
  },
  createAdapter() {
    let timer: ReturnType<typeof setInterval> | undefined;
    return {
      async start({ signal, mayCollect }) {
        if (signal.aborted || !mayCollect()) return;
        const resource = await fetch('https://consent-test.invalid/sdk', { signal });
        await resource.text();
        if (signal.aborted || !mayCollect()) return;
        localStorage.setItem('bookme.test-analytics', 'synthetic');
        sessionStorage.setItem('bookme.test-session', 'synthetic');
        document.cookie = 'bookme_test_analytics=synthetic; Path=/; Max-Age=15552000; SameSite=Lax';
        const send = () => {
          if (signal.aborted || !mayCollect()) return;
          void fetch('https://consent-test.invalid/event', { method: 'POST', body: 'synthetic-page-event', signal }).catch(() => {});
        };
        send();
        timer = setInterval(send, 1000);
      },
      stop() { clearInterval(timer); },
      clear() {
        // One inaccessible store must not prevent cleanup of the others.
        try { localStorage.removeItem('bookme.test-analytics'); } catch { /* Unavailable. */ }
        try { sessionStorage.removeItem('bookme.test-session'); } catch { /* Unavailable. */ }
        try { document.cookie = 'bookme_test_analytics=; Path=/; Max-Age=0; SameSite=Lax'; } catch { /* Unavailable. */ }
      },
    };
  },
};
