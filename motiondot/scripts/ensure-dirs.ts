/**
 * temp/ · outputs/ 디렉터리 초기화
 * 실행: npx tsx scripts/ensure-dirs.ts
 */
import { ensureStorageDirs } from '@/lib/storage';

await ensureStorageDirs();
console.log('[MotionDot] storage directories ready');
