/**
 * Lazy Loading Test Helpers
 * Core utilities for browser-based lazy loading verification.
 */

const puppeteer = require('puppeteer');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:8000';

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 375, height: 812 },
};

/** Pages to test with expected minimum lazy image counts */
const TEST_PAGES = [
  { name: 'Food & Confectionery', path: '/products/food.html', minLazy: 6 },
  { name: 'Health & Beauty', path: '/products/health-beauty.html', minLazy: 6 },
  { name: 'Pharma & Supplements', path: '/products/pharma.html', minLazy: 5 },
  { name: 'Gift Box', path: '/products/gift.html', minLazy: 6 },
  { name: 'Custom Packaging', path: '/custom-packaging.html', minLazy: 6 },
  { name: 'About', path: '/about.html', minLazy: 1 },
  { name: 'Blog', path: '/blog.html', minLazy: 2 },
];

/**
 * Launch a Puppeteer browser with viewport and optional throttling.
 */
async function createBrowser(mode = 'desktop') {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS[mode]);

  if (mode === 'mobile') {
    const client = await page.target().createCDPSession();
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50000,
      uploadThroughput: 20000,
      latency: 400,
    });
  }

  return { browser, page };
}

/**
 * Extract all <img> element info from the page.
 */
async function getImageInfo(page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => {
      const rect = img.getBoundingClientRect();
      return {
        src: img.currentSrc || img.src || '',
        alt: img.alt || '',
        loading: img.loading || 'none',
        isLoaded: img.complete && img.naturalWidth > 0,
        isBroken: img.complete && img.naturalWidth === 0,
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
      };
    });
  });
}

/**
 * Set up image request tracking on a page.
 * Returns an object with request log and phase control.
 */
function trackImageRequests(page) {
  const requests = [];
  let phase = 'initial';

  page.on('request', (req) => {
    if (req.resourceType() === 'image') {
      requests.push({
        url: req.url(),
        name: decodeURIComponent(req.url().split('/').pop().split('?')[0]),
        timestamp: Date.now(),
        phase,
      });
    }
  });

  return {
    requests,
    setPhase: (p) => { phase = p; },
    get count() { return requests.length; },
    get initialCount() { return requests.filter(r => r.phase === 'initial').length; },
    get scrollCount() { return requests.filter(r => r.phase === 'scrolling').length; },
  };
}

/**
 * Simulate progressive scrolling on a page.
 */
async function simulateScroll(page, viewportHeight, steps = 10, delay = 600) {
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const stepSize = Math.ceil((pageHeight - viewportHeight) / steps);

  for (let step = 1; step <= steps; step++) {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' }),
      step * stepSize
    );
    await new Promise(r => setTimeout(r, delay));
  }
}

/**
 * Wait for all images on the page to finish loading (or error).
 */
async function waitForAllImages(page, timeout = 10000) {
  await page.evaluate((ms) => {
    return new Promise((resolve) => {
      const imgs = document.querySelectorAll('img');
      if (imgs.length === 0) return resolve();
      let count = 0;
      const check = () => { if (++count >= imgs.length) resolve(); };
      const timer = setTimeout(resolve, ms);
      imgs.forEach(img => {
        if (img.complete) check();
        else {
          img.addEventListener('load', check, { once: true });
          img.addEventListener('error', check, { once: true });
        }
      });
    });
  }, timeout);
}

/**
 * Check if page has horizontal overflow.
 */
async function hasHorizontalOverflow(page) {
  return page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
}

module.exports = {
  BASE_URL,
  VIEWPORTS,
  TEST_PAGES,
  createBrowser,
  getImageInfo,
  trackImageRequests,
  simulateScroll,
  waitForAllImages,
  hasHorizontalOverflow,
};
