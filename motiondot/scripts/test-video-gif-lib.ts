/**
 * 브라우저 비디오→GIF 유틸 단위 검증 (Node에서 실행 가능한 부분)
 * npx tsx scripts/test-video-gif-lib.ts
 */
import {
  validateBrowserVideoFile,
  validateTrimSegment,
} from '../features/video-gif/lib/validate-browser-video';
import {
  BROWSER_VIDEO_MAX_BYTES,
  BROWSER_VIDEO_MAX_SEGMENT_SEC,
} from '../features/video-gif/constants';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function mockFile(name: string, type: string, size: number): File {
  return { name, type, size } as File;
}

assert(validateBrowserVideoFile(mockFile('a.mp4', 'video/mp4', 1000)) === null, 'mp4 ok');
assert(validateBrowserVideoFile(mockFile('a.webm', 'video/webm', 1000)) === null, 'webm ok');
assert(validateBrowserVideoFile(mockFile('a.mov', 'video/quicktime', 1000)) === null, 'mov ok');
assert(
  validateBrowserVideoFile(mockFile('big.mp4', 'video/mp4', BROWSER_VIDEO_MAX_BYTES + 1)) !== null,
  'size limit',
);
assert(
  validateBrowserVideoFile(mockFile('x.txt', 'text/plain', 1000)) !== null,
  'non-video rejected',
);

assert(validateTrimSegment(0, 5, 10) === null, 'valid trim');
assert(validateTrimSegment(0, 5, 3) !== null, 'end past duration');
assert(
  validateTrimSegment(0, BROWSER_VIDEO_MAX_SEGMENT_SEC + 1, 120) !== null,
  'segment too long',
);

console.log('[video-gif-lib] ALL PASSED');
