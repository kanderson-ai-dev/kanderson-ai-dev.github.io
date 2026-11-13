// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scrollToId } from './useHashScroll';

// Controlled rAF queue — the helper's scroll-end watcher and the post-release
// correction both advance one rAF at a time, so tests flush frame by frame.
let rafQueue: FrameRequestCallback[];
const flush = (n = 1) => {
  for (let i = 0; i < n; i += 1) {
    const q = rafQueue;
    rafQueue = [];
    for (const cb of q) cb(performance.now());
  }
};

const motion = (reduce: boolean) => (q: string) => ({
  matches: reduce && q === '(prefers-reduced-motion: reduce)',
  media: q,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  onchange: null,
  dispatchEvent: vi.fn(),
});

let scrollIntoView: ReturnType<typeof vi.fn>;
let scrollBy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  rafQueue = [];
  scrollIntoView = vi.fn();
  scrollBy = vi.fn();
  Element.prototype.scrollIntoView =
    scrollIntoView as unknown as typeof Element.prototype.scrollIntoView;
  window.scrollBy = scrollBy as unknown as typeof window.scrollBy;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafQueue.push(cb);
    return rafQueue.length;
  });
  vi.stubGlobal('matchMedia', motion(false));
  document.body.innerHTML = '<div id="target"></div><div id="other"></div>';
  document.documentElement.classList.remove('cv-off');
});

afterEach(() => {
  flush(60); // drain in-flight scrolls so the module's refcount returns to 0
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
  document.documentElement.classList.remove('cv-off');
});

describe('scrollToId', () => {
  it('holds html.cv-off for the scroll, calls scrollIntoView smooth, then releases', () => {
    const el = document.getElementById('target')!;
    scrollToId('target');
    expect(document.documentElement).toHaveClass('cv-off');
    flush(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    // watcher: scrollY never moves -> still grows past 10 after frame 12
    flush(30);
    // release happens, then the deferred correction frames run
    flush(10);
    expect(document.documentElement).not.toHaveClass('cv-off');
    expect(el).toHaveAttribute('tabindex', '-1');
  });

  it('scrolls instantly under prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', motion(true));
    scrollToId('target');
    flush(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('moves focus to the target for keyboard and screen-reader users', () => {
    const el = document.getElementById('target')!;
    const focus = vi.spyOn(el, 'focus');
    scrollToId('target');
    flush(40);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(el).toHaveAttribute('tabindex', '-1');
  });

  it('does nothing when the target is missing', () => {
    scrollToId('nope');
    expect(document.documentElement).not.toHaveClass('cv-off');
    flush(10);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('keeps cv-off until every in-flight scroll finishes (refcount)', () => {
    scrollToId('target');
    flush(10);
    scrollToId('other');
    flush(10); // first scroll's watcher has finished, second is still running
    expect(document.documentElement).toHaveClass('cv-off');
    flush(30); // second finishes too
    expect(document.documentElement).not.toHaveClass('cv-off');
  });
});
