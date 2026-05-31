'use client';

import { useCallback } from 'react';
import { useBatchStore } from '@/stores';
import { MAX_UPLOAD_FILES, type UploadMediaKind } from '../constants';
import { uploadMediaParallel } from '../services/upload-client';
import { useUploadUiStore } from '../stores/use-upload-ui-store';
import { validateImageFile } from '../utils/validate-image-file';
import { validateVideoFile } from '../utils/validate-video-file';

/** 다중 미디어 업로드 큐 */
export function useUploadQueue(mediaKind: UploadMediaKind = 'video') {
  const addFiles = useBatchStore((s) => s.addFiles);
  const removeBatchFile = useBatchStore((s) => s.removeFile);
  const items = useUploadUiStore((s) => s.items);
  const isUploading = useUploadUiStore((s) => s.isUploading);
  const enqueueFiles = useUploadUiStore((s) => s.enqueueFiles);
  const updateItem = useUploadUiStore((s) => s.updateItem);
  const removeItem = useUploadUiStore((s) => s.removeItem);
  const setUploading = useUploadUiStore((s) => s.setUploading);
  const setRejectionMessage = useUploadUiStore((s) => s.setRejectionMessage);

  const validate = mediaKind === 'image' ? validateImageFile : validateVideoFile;

  const processFiles = useCallback(
    async (files: File[]) => {
      setRejectionMessage(null);

      const valid: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const err = validate(file);
        if (err) errors.push(`${file.name}: ${err}`);
        else valid.push(file);
      }

      if (errors.length > 0) {
        setRejectionMessage(errors.slice(0, 3).join(' · '));
      }
      if (valid.length === 0) return;

      const slots = MAX_UPLOAD_FILES - items.length;
      if (slots <= 0) {
        setRejectionMessage(`최대 ${MAX_UPLOAD_FILES}개까지 업로드할 수 있습니다.`);
        return;
      }

      const toUpload = valid.slice(0, slots);
      const localIds = enqueueFiles(toUpload);
      setUploading(true);

      const uploadItems = toUpload.map((file, i) => ({
        file,
        localId: localIds[i],
      }));

      for (const { localId } of uploadItems) {
        updateItem(localId, { status: 'uploading', progress: 0 });
      }

      const results = await uploadMediaParallel(
        uploadItems.map(({ file, localId }) => ({
          file,
          onProgress: (progress) => updateItem(localId, { status: 'uploading', progress }),
        })),
        mediaKind,
        3,
      );

      const succeeded = [];
      for (let i = 0; i < results.length; i++) {
        const { localId } = uploadItems[i];
        const result = results[i];
        if (result.meta) {
          updateItem(localId, { status: 'success', progress: 100, meta: result.meta });
          succeeded.push(result.meta);
        } else {
          updateItem(localId, {
            status: 'error',
            progress: 0,
            error: result.error ?? 'Upload failed',
          });
        }
      }

      if (succeeded.length > 0) addFiles(succeeded);
      setUploading(false);
    },
    [items.length, enqueueFiles, updateItem, addFiles, setUploading, setRejectionMessage, validate, mediaKind],
  );

  const removeUploadedFile = useCallback(
    (localId: string, metaId?: string) => {
      removeItem(localId);
      if (metaId) removeBatchFile(metaId);
    },
    [removeItem, removeBatchFile],
  );

  return { items, isUploading, processFiles, removeUploadedFile };
}
