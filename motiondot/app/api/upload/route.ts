import { saveUploadBuffer } from '@/features/upload/services/upload-service';

/** 다중 비디오 업로드 API (파일당 1회 호출) */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!file || !(file instanceof File)) {
      return Response.json({ error: 'file required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const meta = await saveUploadBuffer(buffer, file.name, file.type || 'application/octet-stream');

    return Response.json(meta);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    const status = message.includes('Only video') || message.includes('exceeds') ? 400 : 500;
    return Response.json({ error: message }, { status });
  }
}
