'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useBatchStore } from '@/stores';
import { uploadFilesClient } from '../services/upload-client';

/** react-dropzone + API 업로드 + 배치 스토어 */
export function useFileDropzone() {
  const addFiles = useBatchStore((s) => s.addFiles);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const metas = await uploadFilesClient(accepted);
      addFiles(metas);
    },
    [addFiles],
  );

  return useDropzone({
    onDrop,
    accept: { 'video/*': [], 'image/*': [] },
    multiple: true,
  });
}
