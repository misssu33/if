import { saveUploadBuffer } from '@/features/upload/services/upload-service';

/** 업로드 파이프라인 API */
export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get('file');

  if (!file || !(file instanceof File)) {
    return Response.json({ error: 'file required' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const meta = await saveUploadBuffer(buffer, file.name, file.type);

  return Response.json(meta);
}
