'use client';

import type { UploadMediaKind } from '../constants';
import { useMediaDropzone } from '../hooks/use-media-dropzone';
import { useUploadUiStore } from '../stores/use-upload-ui-store';
import { MAX_UPLOAD_FILES } from '../constants';
import { UploadFileList } from './upload-file-list';

type UploadZoneProps = {
  mediaKind?: UploadMediaKind;
  compact?: boolean;
};

/** 드래그 앤 드롭 업로드 (비디오 · 이미지) */
export function UploadZone({ mediaKind = 'video', compact = false }: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } =
    useMediaDropzone(mediaKind);

  const isUploading = useUploadUiStore((s) => s.isUploading);
  const rejectionMessage = useUploadUiStore((s) => s.rejectionMessage);
  const itemCount = useUploadUiStore((s) => s.items.length);

  const isImage = mediaKind === 'image';
  const borderClass = isDragReject
    ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
    : isDragActive && isDragAccept
      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
      : 'border-zinc-300 hover:border-violet-400 dark:border-zinc-700';

  return (
    <section className="flex min-w-0 flex-col gap-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed text-center transition-colors ${borderClass} ${
          compact ? 'p-5 sm:p-6' : 'min-h-[11rem] p-6 sm:min-h-[12rem] sm:p-8'
        } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} aria-label={isImage ? '이미지 선택' : '비디오 선택'} />
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {isDragActive
              ? '여기에 놓으세요'
              : isImage
                ? '이미지를 드래그하거나 클릭'
                : '비디오를 드래그하거나 클릭'}
          </p>
          <p className="text-xs text-zinc-500">
            {isImage
              ? 'JPG, PNG, WebP · 템플릿·미리보기용'
              : `MP4, MOV, WebM · 최대 ${MAX_UPLOAD_FILES}개`}
          </p>
          {isUploading && <p className="text-xs text-violet-600">업로드 중…</p>}
        </div>
      </div>
      {rejectionMessage && (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {rejectionMessage}
        </p>
      )}
      {itemCount > 0 && <UploadFileList />}
    </section>
  );
}
