'use client';

import { useCallback } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import {
  MAX_UPLOAD_FILES,
  MAX_VIDEO_BYTES,
  VIDEO_ACCEPT,
} from '../constants';
import { useUploadQueue } from './use-upload-queue';
import { useUploadUiStore } from '../stores/use-upload-ui-store';

function formatRejection(rejections: FileRejection[]): string {
  const messages = rejections.slice(0, 3).map((r) => {
    const code = r.errors[0]?.code ?? 'unknown';
    if (code === 'file-too-large') return `${r.file.name}: 용량 초과`;
    if (code === 'file-invalid-type') return `${r.file.name}: 지원하지 않는 형식`;
    return `${r.file.name}: 업로드 불가`;
  });
  return messages.join(' · ');
}

/** react-dropzone — 다중 비디오 드래그 앤 드롭 */
export function useFileDropzone() {
  const { processFiles, isUploading } = useUploadQueue();
  const setRejectionMessage = useUploadUiStore((s) => s.setRejectionMessage);

  const onDrop = useCallback(
    (accepted: File[]) => {
      void processFiles(accepted);
    },
    [processFiles],
  );

  const onDropRejected = useCallback(
    (rejections: FileRejection[]) => {
      setRejectionMessage(formatRejection(rejections));
    },
    [setRejectionMessage],
  );

  return useDropzone({
    onDrop,
    onDropRejected,
    accept: VIDEO_ACCEPT,
    multiple: true,
    maxFiles: MAX_UPLOAD_FILES,
    maxSize: MAX_VIDEO_BYTES,
    disabled: isUploading,
    noClick: false,
    noKeyboard: false,
  });
}
