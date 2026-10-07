import { consentText } from './text';
import { lifetime, readChoice, storageKey, type Choice, type ConsentRecord } from './record';
import { consentVersion, provider } from './config';
import type { AnalyticsAdapter } from './provider-contract';

const banner = document.querySelector<HTMLElement>('#cookie-notice')!;
const dialog = document.querySelector<HTMLDialogElement>('#cookie-settings')!;
const footer = document.querySelector<HTMLAnchorElement>('[data-cookie-footer]')!;
const checkbox = dialog.querySelector<HTMLInputElement>('input[name="analytics"]')!;
const text = consentText[banner.dataset.locale === 'ro' ? 'ro' : 'en'];
let saved: ConsentRecord | null = null;
let failed = false;
let dismissed = false;
let opener: HTMLElement = footer;
let adapter: AnalyticsAdapter | undefined;
let active: AbortController | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
let adapterFailed = false;
let suspended = false;

function stop(clear = true) {
  active?.abort();
  active = undefined;
  try { adapter?.stop(); } catch { /* Permission is already revoked. */ }
  if (clear) {
    try { adapter?.clear(); } catch { /* Some browser storage may be inaccessible. */ }
  }
}

function reconcile() {
  if (suspended) { stop(false); return; }
  if (provider && !adapter && !adapterFailed) {
    try { adapter = provider.createAdapter(); } catch { adapterFailed = true; }
  }
  if (failed || saved?.choice !== 'allowed' || !adapter) { stop(); return; }
  if (active || adapterFailed) return;
  const permission = new AbortController();
  active = permission;
  const mayCollect = () => {
    if (permission.signal.aborted || failed) return false;
    refresh();
    return !permission.signal.aborted && saved?.choice === 'allowed';
  };
  try {
    Promise.resolve(adapter.start({ signal: permission.signal, mayCollect })).catch(() => {
      if (active !== permission) return;
      adapterFailed = true;
      stop();
    });
  } catch { adapterFailed = true; stop(); }
}

function render() {
  banner.hidden = Boolean(saved) || dismissed;
  dialog.querySelector<HTMLElement>('[data-cookie-state]')!.textContent = saved ? text[saved.choice] : text.pending;
  document.querySelectorAll<HTMLElement>('[data-consent-error]').forEach((element) => { element.hidden = !failed; });
  banner.querySelector<HTMLElement>('[data-cookie-dismiss]')!.hidden = !failed;
}

function refresh() {
  const previous = saved;
  try { saved = failed ? null : readChoice(consentVersion, Boolean(provider)); }
  catch { saved = null; failed = true; }
  if (dialog.open && (previous?.choice !== saved?.choice || previous?.actedAt !== saved?.actedAt)) checkbox.checked = saved?.choice === 'allowed';
  clearTimeout(timer);
  if (saved) timer = setTimeout(refresh, Math.min(saved.expiresAt - Date.now(), 60_000));
  reconcile();
  render();
}

function close() {
  dialog.close();
  (opener.closest('[hidden]') ? footer : opener).focus({ preventScroll: false });
}

function save(choice: Choice, trigger: HTMLButtonElement) {
  // Stop before attempting persistence: a failed withdrawal must still stop this page.
  if (choice !== 'allowed') stop();
  const actedAt = Date.now();
  const record: ConsentRecord = { schemaVersion: 1, noticeVersion: consentVersion, choice, actedAt, expiresAt: actedAt + lifetime };
  try {
    localStorage.getItem(storageKey);
    const raw = JSON.stringify(record);
    localStorage.setItem(storageKey, raw);
    if (localStorage.getItem(storageKey) !== raw) throw new Error('Choice not stored');
    failed = false;
    dismissed = false;
    adapterFailed = false;
    refresh();
    if (dialog.open) close();
  } catch {
    failed = true;
    saved = null;
    stop();
    // Best effort removal of an older permission if writes have become unavailable.
    try { localStorage.removeItem(storageKey); } catch { /* Keep this document blocked. */ }
    render();
    trigger.focus({ preventScroll: true });
    trigger.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }
}

for (const trigger of document.querySelectorAll<HTMLElement>('[data-cookie-open], [data-cookie-footer]')) {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    opener = trigger;
    refresh();
    checkbox.checked = saved?.choice === 'allowed';
    dialog.showModal();
  });
}
dialog.querySelector('[data-cookie-close]')!.addEventListener('click', close);
dialog.querySelector('a')!.addEventListener('click', close);
dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const controls = [...dialog.querySelectorAll<HTMLElement>('a[href], button:enabled, input:enabled')];
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.querySelector('h2'))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});
const saveButton = dialog.querySelector<HTMLButtonElement>('[data-cookie-save]')!;
saveButton.addEventListener('click', () => save(provider ? checkbox.checked ? 'allowed' : 'denied' : 'acknowledged', saveButton));
for (const button of banner.querySelectorAll<HTMLButtonElement>('[data-choice]')) {
  button.addEventListener('click', () => save(button.dataset.choice as Choice, button));
}
banner.querySelector('[data-cookie-dismiss]')!.addEventListener('click', () => { dismissed = true; render(); });
// The notice floats over the page: expose its current height so CSS can reserve space while it is shown.
const root = document.documentElement.style;
new ResizeObserver(() => {
  if (banner.offsetHeight) root.setProperty('--cookie-notice-height', `${banner.offsetHeight}px`);
  else root.removeProperty('--cookie-notice-height');
}).observe(banner);
window.addEventListener('storage', (event) => { if (event.key === storageKey || event.key === null) refresh(); });
window.addEventListener('pageshow', () => { suspended = false; refresh(); });
window.addEventListener('pagehide', () => { suspended = true; clearTimeout(timer); stop(false); });
document.addEventListener('visibilitychange', refresh);
refresh();
