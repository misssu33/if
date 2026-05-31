import { saveUploadBuffer } from '@/features/upload/services/upload-service';
import type { UploadMediaKind } from '@/features/upload/constants';

/** 미디어 업로드 API (비디오 · 이미지) */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const kindRaw = form.get('mediaKind');
    const mediaKind: UploadMediaKind =
      kindRaw === 'image' ? 'image' : 'video';

    if (!file || !(file instanceof File)) {
      return Response.json({ error: 'file required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const meta = await saveUploadBuffer(
      buffer,
      file.name,
      file.type || 'application/octet-stream',
      mediaKind,
    );

    return Response.json(meta);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    const status =
      message.includes('Only') || message.includes('exceeds') ? 400 : 500;
    return Response.json({ error: message }, { status });
  }
}
