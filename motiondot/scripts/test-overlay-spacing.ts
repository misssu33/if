/**
 * 오버레이 스택 간격 규칙 검증
 * npx tsx scripts/test-overlay-spacing.ts
 */
import {
  getOverlaySpacing,
  resolveAspectPreset,
} from '../features/templates/layouts/overlay-spacing';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

for (const [ar, w, h, preset] of [
  ['9:16', 1080, 1920, '9:16'],
  ['1:1', 1000, 1000, '1:1'],
  ['16:9', 1920, 1080, '16:9'],
] as const) {
  assert(resolveAspectPreset(ar, w, h) === preset, `preset ${ar}`);
  const s = getOverlaySpacing(ar, w, h);
  assert(s.bottomPaddingPx > s.topPaddingPx / 2, `padding ${ar}`);
  assert(s.stackGapPx >= 8, `gap ${ar}`);
}

console.log('[overlay-spacing] ALL PASSED');
