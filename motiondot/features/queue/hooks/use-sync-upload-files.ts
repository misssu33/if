'use client';

import { useEffect } from 'react';
import { useBatchStore } from '@/stores';
import { useConversionStore } from '../stores/use-conversion-store';

/** 업로드 파일 목록 → conversion store 동기화 */
export function useSyncUploadFiles() {
  const files = useBatchStore((s) => s.files);
  const syncUploadFiles = useConversionStore((s) => s.syncUploadFiles);

  useEffect(() => {
    syncUploadFiles(files);
  }, [files, syncUploadFiles]);
}
