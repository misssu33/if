import type { OutputFormat } from '@/types';
import type { ConvertByFormatOptions, ConvertOptions } from './types';
import type { RunFfmpegOptions } from './run-command';
import { encodeGif } from './gif';
import { encodeMp4 } from './mp4';
import { encodeWebp } from './webp';

/** 포맷별 변환 디스패치 */
export async function convertByFormat(
  options: ConvertByFormatOptions,
  runOptions?: RunFfmpegOptions,
): Promise<void> {
  const { format, ...base } = options;
  switch (format) {
    case 'gif':
      return encodeGif(base, runOptions);
    case 'mp4':
      return encodeMp4(base, runOptions);
    case 'webp':
      return encodeWebp(base, runOptions);
    default: {
      const _exhaustive: never = format;
      throw new Error(`Unsupported format: ${String(_exhaustive)}`);
    }
  }
}

export type { ConvertOptions, ConvertQuality } from './types';
