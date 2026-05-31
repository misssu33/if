'use client';

import { useCallback } from 'react';
import { useBatchStore } from '@/stores';
import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import { useEnqueueUploadedMedia } from '@/features/queue/hooks/use-enqueue-uploaded-media';
import { MAX_UPLOAD_FILES, type UploadMediaKind } from '../constants';
import { uploadMediaParallel } from '../services/upload-client';
import { useUploadUiStore } from '../stores/use-upload-ui-store';
import { validateImageFile } from '../utils/validate-image-file';
import { validateVideoFile } from '../utils/validate-video-file';

/** 업로드 → Zustand 큐 파이프라인 (pending → queued → …) */
export function useUploadQueue(mediaKind: UploadMediaKind = 'video') {
  const addFiles = useBatchStore((s) => s.addFiles);
  const removeBatchFile = useBatchStore((s) => s.removeFile);
  const isUploading = useUploadUiStore((s) => s.isUploading);
  const setUploading = useUploadUiStore((s) => s.setUploading);
  const setRejectionMessage = useUploadUiStore((s) => s.setRejectionMessage);

  const registerPendingUploads = useConversionStore((s) => s.registerPendingUploads);
  const setUploadProgress = useConversionStore((s) => s.setUploadProgress);
  const markUploadComplete = useConversionStore((s) => s.markUploadComplete);
  const failJobByLocalId = useConversionStore((s) => s.failJobByLocalId);
  const removeJobByLocalId = useConversionStore((s) => s.removeJobByLocalId);
  const jobs = useConversionStore((s) => s.jobs);

  const { enqueueUploaded } = useEnqueueUploadedMedia();

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

      const pendingCount = jobs.filter((j) => j.localId).length;
      const slots = MAX_UPLOAD_FILES - pendingCount;
      if (slots <= 0) {
        setRejectionMessage(`최대 ${MAX_UPLOAD_FILES}개까지 업로드할 수 있습니다.`);
        return;
      }

      const toUpload = valid.slice(0, slots);
      const localIds = toUpload.map(() => crypto.randomUUID());

      registerPendingUploads(
        toUpload.map((file, i) => ({
          localId: localIds[i],
          fileName: file.name,
          mediaKind,
        })),
      );

      setUploading(true);

      const results = await uploadMediaParallel(
        toUpload.map((file, i) => ({
          file,
          onProgress: (progress) =>
            setUploadProgress(localIds[i], progress, `업로드 중 ${progress}%`),
        })),
        mediaKind,
        3,
      );

      const enqueuePayload: { localId: string; meta: (typeof results)[0]['meta'] }[] = [];

      for (let i = 0; i < results.length; i++) {
        const localId = localIds[i];
        const result = results[i];
        if (result.meta) {
          markUploadComplete(localId, result.meta);
          addFiles([result.meta]);
          enqueuePayload.push({ localId, meta: result.meta });
        } else {
          failJobByLocalId(localId, result.error ?? 'Upload failed');
        }
      }

      if (enqueuePayload.length > 0) {
        try {
          await enqueueUploaded(
            enqueuePayload.filter(
              (p): p is { localId: string; meta: NonNullable<typeof p.meta> } =>
                !!p.meta,
            ),
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Queue enqueue failed';
          for (const { localId } of enqueuePayload) {
            failJobByLocalId(localId, msg);
          }
        }
      }

      setUploading(false);
    },
    [
      jobs,
      registerPendingUploads,
      setUploadProgress,
      markUploadComplete,
      failJobByLocalId,
      addFiles,
      enqueueUploaded,
      setUploading,
      setRejectionMessage,
      validate,
      mediaKind,
    ],
  );

  const removeUploadedFile = useCallback(
    (localId: string, metaId?: string) => {
      removeJobByLocalId(localId);
      if (metaId) removeBatchFile(metaId);
    },
    [removeJobByLocalId, removeBatchFile],
  );

  const pipelineItems = jobs.filter((j) => j.localId);

  return {
    items: pipelineItems,
    isUploading,
    processFiles,
    removeUploadedFile,
  };
}
