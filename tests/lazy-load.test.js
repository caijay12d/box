/**
 * Lazy Loading Automated Test Suite
 *
 * Tests:
 *  1. DOM attribute verification — all content images have loading="lazy"
 *  2. Desktop load integrity — no broken images, no horizontal overflow
 *  3. Mobile deferred loading — below-fold images deferred until scroll
 *
 * Usage:
 *   npm test                  — run all tests
 *   npm test -- --testNamePattern="DOM"  — run specific suite
 */

const {
  BASE_URL,
  VIEWPORTS,
  TEST_PAGES,
  createBrowser,
  getImageInfo,
  trackImageRequests,
  simulateScroll,
  waitForAllImages,
  hasHorizontalOverflow,
} = require('./helpers');

// ─── Suite 1: DOM Attribute Verification (Desktop, fast) ─────────────

describe('DOM: loading="lazy" attributes', () => {
  describe.each(TEST_PAGES)('$name', ({ path, minLazy }) => {
    let browser, page;

    beforeAll(async () => {
      ({ browser, page } = await createBrowser('desktop'));
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 500));
    });

    afterAll(async () => { if (browser) await browser.close(); });

    test(`content images have loading="lazy" (≥ ${minLazy})`, async () => {
      const images = await getImageInfo(page);
      const lazy = images.filter(i => i.loading === 'lazy');
      expect(lazy.length).toBeGreaterThanOrEqual(minLazy);
    });

    test('logo images do NOT have loading="lazy"', async () => {
      const images = await getImageInfo(page);
      // Match actual logo files by path, not prompt text in generated image URLs
      const logos = images.filter(i => i.src.includes('images/logo/'));
      expect(logos.length).toBeGreaterThan(0); // Every page should have at least nav logo
      logos.forEach(logo => {
        expect(logo.loading).not.toBe('lazy');
      });
    });
  });
});

// ─── Suite 2: Desktop Load Integrity (Desktop, medium) ───────────────

describe('Desktop: image load integrity', () => {
  describe.each(TEST_PAGES)('$name — $path', ({ path }) => {
    let browser, page;

    beforeAll(async () => {
      ({ browser, page } = await createBrowser('desktop'));
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle0' });
    });

    afterAll(async () => { if (browser) await browser.close(); });

    test('all images load without errors', async () => {
      const images = await getImageInfo(page);
      const broken = images.filter(i => i.isBroken);
      if (broken.length > 0) {
        console.error('Broken images:', broken.map(i => `${i.alt} (${i.src})`));
      }
      expect(broken).toHaveLength(0);
    });

    test('no horizontal overflow', async () => {
      const overflow = await hasHorizontalOverflow(page);
      expect(overflow).toBe(false);
    });
  });
});

// ─── Suite 3: Mobile Deferred Loading (Mobile + Slow 3G, slow) ───────
// Run only on food.html as a representative page (longest product grid)

describe('Mobile: deferred loading (Slow 3G)', () => {
  let browser, page, tracker;

  beforeAll(async () => {
    ({ browser, page } = await createBrowser('mobile'));
    tracker = trackImageRequests(page);
  }, 30000);

  afterAll(async () => { if (browser) await browser.close(); });

  test('below-fold images are NOT requested during initial load', async () => {
    await page.goto(`${BASE_URL}/products/food.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 500));

    const images = await getImageInfo(page);
    const lazy = images.filter(i => i.loading === 'lazy');
    const belowFold = lazy.filter(i => i.top >= VIEWPORTS.mobile.height);

    // Initial requests should be fewer than total lazy images
    // (browser loads above-fold + nearby images, but defers far ones)
    expect(belowFold.length).toBeGreaterThan(0);
    expect(tracker.initialCount).toBeLessThan(lazy.length + 2); // +2 for logos
  }, 30000);

  test('deferred images load progressively on scroll', async () => {
    tracker.setPhase('scrolling');
    await simulateScroll(page, VIEWPORTS.mobile.height, 10, 600);
    await new Promise(r => setTimeout(r, 2000));

    // At least some image requests should have been made during scrolling
    expect(tracker.scrollCount).toBeGreaterThan(0);
  }, 30000);

  test('deferred load ratio > 50%', async () => {
    const images = await getImageInfo(page);
    const lazy = images.filter(i => i.loading === 'lazy');
    const belowFold = lazy.filter(i => i.top >= VIEWPORTS.mobile.height);

    const deferredRatio = belowFold.length > 0
      ? Math.round((tracker.scrollCount / Math.max(belowFold.length, 1)) * 100)
      : 100;

    console.log(`    Deferred ratio: ${deferredRatio}% (${tracker.scrollCount}/${belowFold.length} below-fold images)`);
    expect(deferredRatio).toBeGreaterThan(50);
  }, 15000);

  test('all lazy images eventually requested', async () => {
    const totalReqs = tracker.count;
    const images = await getImageInfo(page);
    const lazy = images.filter(i => i.loading === 'lazy');

    console.log(`    Total image requests: ${totalReqs} (lazy: ${lazy.length})`);
    expect(totalReqs).toBeGreaterThanOrEqual(lazy.length);
  }, 10000);
});
