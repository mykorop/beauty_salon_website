/** Playback owns time and visibility; scenarios supply static frames and captions. */
class PhonePlayback extends HTMLElement {
  connectedCallback() {
    const frames = [...this.querySelectorAll<HTMLElement>('[data-frame]')];
    const phone = this.querySelector<HTMLElement>('[data-phone]');
    const controls = this.querySelector<HTMLElement>('[data-controls]');
    const toggle = this.querySelector<HTMLButtonElement>('[data-toggle]');
    const replay = this.querySelector<HTMLButtonElement>('[data-replay]');
    const next = this.querySelector<HTMLButtonElement>('[data-next]');
    const count = this.querySelector('[data-step-count]');
    const caption = this.querySelector('[data-step-caption]');
    if (!frames.length || !phone || !controls || !toggle || !replay || !next || !count || !caption) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = frames.length - 1;
    let started = false;
    let manuallyPaused = false;
    let visible = false;
    let timer: number | undefined;
    let deadline = 0;
    let remaining = 0;
    const finished = () => index === frames.length - 1;

    const stop = () => {
      if (timer !== undefined) {
        remaining = Math.max(0, deadline - performance.now());
        window.clearTimeout(timer);
        timer = undefined;
      }
      this.dataset.playing = 'false';
    };
    const show = (frame: number) => {
      index = frame;
      frames.forEach((element, i) => { element.hidden = i !== index; });
      count.textContent = `${index + 1} / ${frames.length}`;
      caption.textContent = frames[index].dataset.caption ?? '';
      remaining = Number(frames[index].dataset.duration ?? 2400);
    };
    const sync = () => {
      stop();
      const running = started && visible && !document.hidden && !motion.matches && !manuallyPaused && !finished();
      this.dataset.playing = String(running);
      toggle.textContent = finished() ? this.dataset.finished! : manuallyPaused ? this.dataset.resume! : this.dataset.pause!;
      toggle.disabled = finished();
      toggle.hidden = motion.matches;
      next.hidden = !motion.matches;
      next.disabled = finished();
      if (running) {
        deadline = performance.now() + remaining;
        timer = window.setTimeout(() => {
          timer = undefined;
          show(index + 1);
          sync();
        }, remaining);
      }
    };
    toggle.addEventListener('click', () => { manuallyPaused = !manuallyPaused; sync(); });
    replay.addEventListener('click', () => {
      stop();
      started = true;
      manuallyPaused = false;
      show(0);
      sync();
    });
    next.addEventListener('click', () => {
      stop();
      started = true;
      if (!finished()) show(index + 1);
      sync();
    });
    const visibilityChanged = () => sync();
    const motionChanged = () => {
      const hadFocus = document.activeElement === toggle;
      stop();
      // A preference change never restarts playback, including a change back.
      started = true;
      manuallyPaused = true;
      if (motion.matches) show(frames.length - 1);
      sync();
      if (hadFocus && motion.matches) replay.focus({ preventScroll: true });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.6;
      if (visible && !started && !motion.matches) {
        started = true;
        show(0);
      }
      sync();
    }, { threshold: [0, 0.6] });
    document.addEventListener('visibilitychange', visibilityChanged);
    motion.addEventListener('change', motionChanged);
    observer.observe(phone);
    controls.hidden = false;
    sync();
    this.cleanup = () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibilityChanged);
      motion.removeEventListener('change', motionChanged);
    };
  }

  private cleanup?: () => void;
  disconnectedCallback() { this.cleanup?.(); }
}

customElements.define('phone-playback', PhonePlayback);
