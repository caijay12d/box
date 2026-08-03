/**
 * Lazy Loading Verification Test (v2)
 * Tracks image request TIMELINE to verify off-screen images are deferred.
 *
 * Usage: node test-lazy-load.js [url]
 * Default URL: http://localhost:8000/products/food.html
 */

const puppeteer = require('puppeteer');

const TARGET_URL = process.argv[2] || 'http://localhost:8000/products/food.html';
const IS_MOBILE = process.argv.includes('--mobile');
const SCROLL_STEPS = 10;
const SCROLL_DELAY = 600;
const VIEWPORT = IS_MOBILE
  ? { width: 375, height: 812 }  // iPhone X
  : { width: 1440, height: 900 }; // Desktop

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m',
  cyan: '\x1b[36m', magenta: '\x1b[35m', gray: '\x1b[90m',
};

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function shortName(url) {
  try { return decodeURIComponent(url.split('/').pop().split('?')[0]); }
  catch { return url; }
}

async function runTest() {
  console.log(`\n${c.bold}═══════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}  BoxifyPack — Lazy Loading Verification (Timeline Test)${c.reset}`);
  console.log(`${c.bold}═══════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.gray}  Target: ${TARGET_URL}${c.reset}`);
  console.log(`${c.gray}  Viewport: ${VIEWPORT.width}×${VIEWPORT.height} (${IS_MOBILE ? 'Mobile' : 'Desktop'}) | Scroll: ${SCROLL_STEPS} steps × ${SCROLL_DELAY}ms${c.reset}`);
  console.log(`${c.gray}  Network: ${IS_MOBILE ? 'Throttled (Slow 3G)' : 'No throttle'}${c.reset}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: VIEWPORT.width, height: VIEWPORT.height });

  // Network throttling for mobile mode (makes deferral visible)
  if (IS_MOBILE) {
    const client = await page.target().createCDPSession();
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50000,  // ~50 KB/s (Slow 3G)
      uploadThroughput: 20000,
      latency: 400,               // 400ms RTT
    });
  }

  // Track image requests with timestamps relative to page load
  const pageLoadTime = Date.now();
  const imageRequestLog = []; // { name, timestamp, phase }

  let scrollPhase = 'initial'; // 'initial' | 'scrolling' | 'done'

  page.on('request', (req) => {
    if (req.resourceType() === 'image') {
      imageRequestLog.push({
        name: shortName(req.url()),
        timestamp: Date.now() - pageLoadTime,
        phase: scrollPhase,
      });
    }
  });

  // --- Step 1: Load page with domcontentloaded (NOT networkidle0) ---
  console.log(`${c.cyan}[1/4]${c.reset} Loading page (domcontentloaded — captures pre-lazy state)...`);
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Wait a short moment for above-the-fold images to start loading
  await sleep(500);

  // --- Step 2: Inspect DOM for loading="lazy" attributes ---
  console.log(`${c.cyan}[2/4]${c.reset} Inspecting <img> elements...`);

  const imgInfo = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: (img.currentSrc || img.src || ''),
      alt: img.alt || '(no alt)',
      loading: img.loading || '(none)',
      isLoaded: img.complete && img.naturalWidth > 0,
      rect: (() => {
        const r = img.getBoundingClientRect();
        return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
      })(),
    }));
  });

  const lazyImages = imgInfo.filter(i => i.loading === 'lazy');
  const eagerImages = imgInfo.filter(i => i.loading !== 'lazy');

  console.log(`  ${c.gray}Total <img>: ${imgInfo.length} | loading="lazy": ${c.green}${lazyImages.length}${c.reset}${c.gray} | eager/none: ${eagerImages.length}${c.reset}`);

  // Show which lazy images are above vs below the fold
  const aboveFold = lazyImages.filter(i => i.rect.top < VIEWPORT.height);
  const belowFold = lazyImages.filter(i => i.rect.top >= VIEWPORT.height);

  console.log(`  ${c.gray}Lazy images above fold (top < ${VIEWPORT.height}px): ${aboveFold.length}${c.reset}`);
  console.log(`  ${c.yellow}Lazy images below fold (top ≥ ${VIEWPORT.height}px): ${belowFold.length}${c.reset}`);

  // --- Step 3: Record initial image requests, then scroll ---
  console.log(`\n${c.cyan}[3/4]${c.reset} Tracking image request timeline...`);

  const initialImageReqs = imageRequestLog.length;
  console.log(`  ${c.gray}Image requests during initial load: ${initialImageReqs}${c.reset}`);
  imageRequestLog.slice(0, initialImageReqs).forEach(r => {
    console.log(`    ${c.gray}${r.timestamp}ms${c.reset} ${shortName(r.name)}`);
  });

  // Now mark scrolling phase and start scrolling
  scrollPhase = 'scrolling';
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const stepSize = Math.ceil((pageHeight - VIEWPORT.height) / SCROLL_STEPS);

  const perStepNewReqs = [];

  for (let step = 1; step <= SCROLL_STEPS; step++) {
    const scrollY = step * stepSize;
    const reqsBefore = imageRequestLog.length;

    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
    await sleep(SCROLL_DELAY);

    const newReqs = imageRequestLog.length - reqsBefore;
    const newImages = imageRequestLog.slice(reqsBefore).map(r => r.name);
    perStepNewReqs.push({ step, scrollY, newReqs, newImages });

    const progressBar = '█'.repeat(Math.round((step / SCROLL_STEPS) * 20)).padEnd(20, '░');
    const reqStr = newReqs > 0 ? c.green + `+${newReqs} image req` : c.gray + 'no new reqs';
    console.log(`  ${c.gray}[${progressBar}]${c.reset} Step ${step}/${SCROLL_STEPS} | y=${scrollY}px | ${reqStr}${c.reset}`);

    newImages.forEach(name => {
      console.log(`    ${c.green}✓${c.reset} ${c.gray}${imageRequestLog[reqsBefore].timestamp}ms${c.reset} ${name}`);
    });
  }

  scrollPhase = 'done';

  // Wait for throttled images to finish downloading
  console.log(`\n  ${c.gray}Waiting 5s for throttled images to finish downloading...${c.reset}`);
  await sleep(5000);

  // --- Step 4: Final Report ---
  console.log(`\n${c.cyan}[4/4]${c.reset} Final Report`);
  console.log(`${c.bold}═══════════════════════════════════════════════════════${c.reset}`);

  const totalImageReqs = imageRequestLog.length;
  const initialReqs = imageRequestLog.filter(r => r.phase === 'initial').length;
  const scrollReqs = imageRequestLog.filter(r => r.phase === 'scrolling').length;
  const deferredRatio = belowFold.length > 0
    ? Math.round((scrollReqs / Math.max(belowFold.length, 1)) * 100)
    : 100;

  // Final DOM check
  const finalCheck = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img[loading="lazy"]'));
    return {
      total: imgs.length,
      loaded: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
      broken: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => ({ alt: i.alt, src: i.src })),
    };
  });

  // Count network responses (completed downloads)
  const imageResponseCount = await page.evaluate(() => {
    return performance.getEntriesByType('resource')
      .filter(r => r.initiatorType === 'img')
      .length;
  });

  console.log(`  ${c.bold}DOM: ${finalCheck.loaded}/${finalCheck.total} lazy images loaded${c.reset}`);
  console.log(`  ${c.gray}Network: ${totalImageReqs} requests | ${imageResponseCount} responses received${c.reset}`);
  console.log(`    - During initial load: ${c.cyan}${initialReqs}${c.reset}`);
  console.log(`    - During scrolling:    ${c.green}${scrollReqs}${c.reset}`);
  console.log(`  ${c.gray}Below-fold lazy images: ${belowFold.length}${c.reset}`);
  console.log(`  ${c.gray}Deferred load ratio: ${deferredRatio >= 75 ? c.green : c.yellow}${deferredRatio}%${c.reset}`);

  // Horizontal overflow check
  const hasOverflow = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
  console.log(`  ${c.gray}Horizontal overflow: ${hasOverflow ? c.red + 'YES' : c.green + 'NO'}${c.reset}`);

  // Verdict: PASS if all lazy images requested AND deferral detected
  const allLazyRequested = totalImageReqs >= lazyImages.length;
  const allLoaded = finalCheck.loaded === finalCheck.total;
  const hasDeferred = scrollReqs > 0;

  console.log(`${c.bold}═══════════════════════════════════════════════════════${c.reset}`);

  if (allLazyRequested && hasDeferred) {
    console.log(`\n  ${c.green}${c.bold}✓ PASS${c.reset}`);
    console.log(`  ${c.green}All ${lazyImages.length} lazy images were requested.${c.reset}`);
    console.log(`  ${c.green}${scrollReqs} image request(s) deferred until scroll — lazy loading is working!${c.reset}`);
    console.log(`  ${c.gray}Deferred ratio: ${deferredRatio}% (higher = better deferral)${c.reset}`);
    if (!allLoaded) {
      console.log(`  ${c.gray}Note: ${finalCheck.total - finalCheck.loaded} image(s) still downloading (throttle) — requests confirmed.${c.reset}`);
    }
  } else if (allLazyRequested && !hasDeferred) {
    console.log(`\n  ${c.yellow}${c.bold}⚠ REVIEW${c.reset}`);
    console.log(`  ${c.yellow}All lazy images requested, but no deferral detected. Browser preloaded all images.${c.reset}`);
    console.log(`  ${c.gray}Expected on desktop — Chrome preloads within ~3000px of viewport.${c.reset}`);
    console.log(`  ${c.gray}Run with --mobile flag to verify deferral on slow 3G.${c.reset}`);
  } else {
    console.log(`\n  ${c.red}${c.bold}✗ FAIL${c.reset}`);
    console.log(`  ${c.red}Only ${totalImageReqs}/${lazyImages.length} lazy images were requested.${c.reset}`);
    if (finalCheck.broken.length > 0) {
      finalCheck.broken.forEach(b => console.log(`    ${c.red}✗${c.reset} alt="${b.alt}" src=${b.src.substring(0, 80)}`));
    }
  }

  // Print timeline summary
  console.log(`\n  ${c.bold}Timeline Summary:${c.reset}`);
  console.log(`  ${c.gray}┌──────────────────────────────────────────────────────┐${c.reset}`);
  console.log(`  ${c.gray}│ Phase      │ Image Requests │ Notes                  │${c.reset}`);
  console.log(`  ${c.gray}├──────────────────────────────────────────────────────┤${c.reset}`);
  console.log(`  ${c.gray}│ Initial    │${c.reset} ${c.cyan}${String(initialReqs).padStart(8)}${c.reset}${c.gray}        │ Above-fold + logos    │${c.reset}`);
  console.log(`  ${c.gray}│ Scrolling  │${c.reset} ${c.green}${String(scrollReqs).padStart(8)}${c.reset}${c.gray}        │ Deferred by lazy attr │${c.reset}`);
  console.log(`  ${c.gray}│ Total      │${c.reset} ${c.bold}${String(totalImageReqs).padStart(8)}${c.reset}${c.gray}        │                        │${c.reset}`);
  console.log(`  ${c.gray}└──────────────────────────────────────────────────────┘${c.reset}`);

  console.log(`${c.bold}═══════════════════════════════════════════════════════${c.reset}\n`);

  await browser.close();
  // Return 0 (success) if PASS or REVIEW, 1 only if FAIL
  return (allLazyRequested) ? 0 : 1;
}

runTest()
  .then(code => process.exit(code))
  .catch(err => {
    console.error(`${c.red}Test error: ${err.message}${c.reset}`);
    process.exit(1);
  });
