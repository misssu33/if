import type { OutputFormat } from '@/types';

/** export 산출물 다운로드 API URL */
export function buildExportDownloadUrl(
  outputPath: string,
  format: OutputFormat,
): string {
  return `/api/export/download?file=${encodeURIComponent(outputPath)}&format=${format}`;
}
