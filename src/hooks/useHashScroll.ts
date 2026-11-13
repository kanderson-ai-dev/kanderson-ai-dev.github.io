// One in-page scroll path (Part C). content-visibility:auto lays unseen
// sections out at their 600px placeholder size, so a naive anchor jump lands
// short on the first click. html.cv-off un-skips every section at real height
// and is held for the whole smooth scroll — releasing it mid-flight collapses
// the document under the moving target. After the scroll settles, cv-off is
// released and one instant correction absorbs the small height drift left by
// remembered contain-intrinsic sizes, then focus moves to the target for
// keyboard / screen-reader users.

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

// Refcount so two scrolls in flight never strip cv-off out from under each other.
let depth = 0;

export const scrollToId = (id: string): void => {
  const el = document.getElementById(id);
  if (!el) return;
  const root = document.documentElement;
  depth += 1;
  root.classList.add('cv-off');

  requestAnimationFrame(() => {
    // Reading the box flushes layout: every .cv section takes its real size
    // before the browser computes the destination offset.
    void el.getBoundingClientRect();
    el.scrollIntoView({
      behavior: reducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });

    const release = () => {
      depth -= 1;
      if (depth === 0) root.classList.remove('cv-off');
      // Re-skipped sections collapse asynchronously over a few frames to
      // remembered sizes that can differ from what they rendered — wait for
      // the target to stop drifting, then nudge so it sits exactly under the
      // sticky chrome (clamped automatically at the page bottom).
      let lastTop = NaN;
      let stableFrames = 0;
      const correct = (round: number) => {
        const top = el.getBoundingClientRect().top;
        stableFrames = Math.abs(top - lastTop) < 0.5 ? stableFrames + 1 : 0;
        lastTop = top;
        if (stableFrames < 3 && round < 90) {
          requestAnimationFrame(() => correct(round + 1));
          return;
        }
        const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        const drift = el.getBoundingClientRect().top - margin;
        if (Math.abs(drift) >= 2) {
          window.scrollBy(0, drift);
          if (round < 120) {
            requestAnimationFrame(() => correct(120));
            return;
          }
        }
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      };
      requestAnimationFrame(() => correct(0));
    };

    // Prefer scrollend; fall back to watching scrollY go still after it has
    // moved at least once (so we don't release before the animation starts).
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      document.removeEventListener('scrollend', finish);
      release();
    };
    document.addEventListener('scrollend', finish);

    let last = -1;
    let still = 0;
    let frames = 0;
    const watch = () => {
      if (done) return;
      const y = window.scrollY;
      still = y === last ? still + 1 : 0;
      last = y;
      frames += 1;
      // still-for-10-frames only counts after frame 12 so the release can't
      // fire before the smooth animation has actually started moving.
      if ((still >= 10 && frames > 12) || frames > 240) finish();
      else requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
  });
};
