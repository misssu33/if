import { estimateExportSize } from '@/lib/export';
import type { ExportSizeEstimateInput } from '@/types/export';
import type { OutputFormat } from '@/types';
import type { PresetQualityLevel } from '@/types';

/** 렌더 전 용량 추정 */
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const format = sp.get('format') as OutputFormat | null;
  const width = Number(sp.get('width'));
  const height = Number(sp.get('height'));
  const fps = Number(sp.get('fps'));
  const durationSec = Number(sp.get('durationSec'));
  const quality = sp.get('quality') as PresetQualityLevel | null;
  const loop = sp.get('loop') === 'true';

  if (!format || !width || !height || !fps || !durationSec || !quality) {
    return Response.json({ error: 'invalid params' }, { status: 400 });
  }

  const input: ExportSizeEstimateInput = {
    format,
    width,
    height,
    fps,
    durationSec,
    quality,
    loop,
  };

  return Response.json(estimateExportSize(input));
}
