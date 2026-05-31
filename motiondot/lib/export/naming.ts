import type { OutputFormat } from '@/types';

/** 출력 파일명 생성 */
export function buildOutputFilename(
  baseName: string,
  format: OutputFormat,
  pattern = '{name}-{format}',
): string {
  const safe = baseName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const stem = pattern
    .replace('{name}', safe)
    .replace('{format}', format)
    .replace('{timestamp}', String(Date.now()));
  return `${stem}.${format}`;
}
