/**
 * 무료 플랜·워터마크 UI 테스트 (Playwright)
 * node scripts/test-free-tier-ui.mjs [baseUrl]
 */
import { chromium, devices } from 'playwright';

const BASE = (process.argv[2] ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const results = [];

function record(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ` — ${detail}` : ''}`);
}

function boxesOverlap(a, b, margin = 4) {
  return (
    a.x + a.width - margin > b.x &&
    b.x + b.width - margin > a.x &&
    a.y + a.height - margin > b.y &&
    b.y + b.height - margin > a.y
  );
}

async function runViewport(browser, label, viewport) {
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    viewport,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(e.message));

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 });
  await page.evaluate(() => {
    localStorage.removeItem('motiondot:onboarding');
    localStorage.removeItem('motiondot:plan');
    sessionStorage.removeItem('motiondot:free-tier:usage');
    sessionStorage.setItem('motiondot:session-id', 'test-session');
    sessionStorage.setItem(
      'motiondot:free-tier:usage',
      JSON.stringify({ exportCount: 0, sessionId: 'test-session' }),
    );
  });
  await page.reload({ waitUntil: 'networkidle', timeout: 90000 });

  await page.getByRole('button', { name: /TikTok 제품 GIF/i }).click({ timeout: 20000 });
  await page.waitForTimeout(600);

  // banner is on preview/export step

  await page.getByRole('button', { name: /다음: 미리보기/i }).click();
  await page.waitForTimeout(2000);

  record(`${label}: preview section`, await page.getByText('광고 모션 미리보기').isVisible());

  const wm = page.getByText('MotionDot', { exact: true }).last();
  record(`${label}: watermark visible`, await wm.isVisible());

  const wmBox = await wm.boundingBox();
  record(`${label}: watermark has position`, !!wmBox, wmBox ? `y=${Math.round(wmBox.y)}` : 'none');

  const layerTexts = ['헤드라인', '서브', 'CTA', '뱃지', 'NEW', '지금'];
  const boxes = [];
  if (wmBox) boxes.push({ name: 'watermark', ...wmBox });

  for (const fragment of layerTexts) {
    const loc = page.getByText(new RegExp(fragment, 'i'));
    const n = Math.min(await loc.count(), 3);
    for (let i = 0; i < n; i++) {
      const box = await loc.nth(i).boundingBox();
      if (box && box.width > 8 && box.height > 8) {
        boxes.push({ name: fragment, ...box });
      }
    }
  }

  let overlapFound = false;
  const overlapPairs = [];
  if (wmBox) {
    for (const b of boxes) {
      if (b.name === 'watermark') continue;
      if (boxesOverlap(wmBox, b)) {
        overlapFound = true;
        overlapPairs.push(`watermark↔${b.name}`);
      }
    }
  }
  record(
    `${label}: watermark no overlap with text layers`,
    !overlapFound,
    overlapPairs.join(', ') || `checked ${boxes.length} boxes`,
  );

  const storage = await page.evaluate(() => ({
    plan: localStorage.getItem('motiondot:plan'),
    usage: sessionStorage.getItem('motiondot:free-tier:usage'),
    prefs: localStorage.getItem('motiondot:free-tier:prefs'),
  }));
  record(
    `${label}: localStorage/session tracking`,
    storage.plan === null || storage.plan === 'free',
    `usage=${storage.usage?.slice(0, 40) ?? 'null'}`,
  );

  const limitsText = await page.getByText(/세션당 Export 5회/).count();
  record(`${label}: export limit messaging`, limitsText > 0);

  const critical = [...consoleErrors, ...pageErrors].filter(
    (e) =>
      !e.includes('favicon') &&
      !/Failed to load chunk/.test(e) &&
      !e.includes('WebSocket connection'),
  );
  record(
    `${label}: no critical console errors`,
    critical.length === 0,
    critical.slice(0, 2).join(' | ') || 'clean',
  );

  await context.close();
}

async function testExportLimitLogic() {
  const { readFileSync } = await import('fs');
  const limitsPath = new URL('../lib/freeTier/config.ts', import.meta.url);
  const applyPath = new URL('../lib/freeTier/apply-limits.ts', import.meta.url);
  record('free tier config files exist', readFileSync(limitsPath).includes('maxExportsPerSession'));
  record('apply-limits exists', readFileSync(applyPath).includes('clampResolution'));
}

async function testApisAndDownload() {
  const health = await fetch(`${BASE}/api/health`);
  record('health API', health.ok);

  const presets = await fetch(`${BASE}/api/presets`);
  const presetsJson = await presets.json();
  record('presets API', presets.ok && presetsJson.length >= 6, `count=${presetsJson.length}`);
}

async function main() {
  console.log(`\n=== Free tier / watermark test @ ${BASE} ===\n`);
  await testExportLimitLogic();
  await testApisAndDownload();

  const browser = await chromium.launch({ headless: true });
  try {
    await runViewport(browser, 'mobile', { width: 390, height: 844 });
    await runViewport(browser, 'desktop', { width: 1280, height: 800 });
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.pass);
  console.log(`\n=== Summary: ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length) {
    failed.forEach((f) => console.log(`  FAIL: ${f.name} — ${f.detail}`));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
