'use client';

import { useFileDropzone } from '../hooks/use-file-dropzone';
import { useUploadUiStore } from '../stores/use-upload-ui-store';
import { MAX_UPLOAD_FILES } from '../constants';
import { UploadFileList } from './upload-file-list';

/** 다중 비디오 드래그 앤 드롭 업로드 */
export function UploadZone() {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useFileDropzone();

  const isUploading = useUploadUiStore((s) => s.isUploading);
  const rejectionMessage = useUploadUiStore((s) => s.rejectionMessage);
  const itemCount = useUploadUiStore((s) => s.items.length);

  const borderClass = isDragReject
    ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
    : isDragActive && isDragAccept
      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
      : 'border-zinc-300 hover:border-violet-400 dark:border-zinc-700';

  return (
    <section className="flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${borderClass} ${
          isUploading ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        <input {...getInputProps()} aria-label="비디오 파일 선택" />
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isDragActive ? 'bg-violet-100 dark:bg-violet-900/50' : 'bg-zinc-100 dark:bg-zinc-800'
            }`}
          >
            <svg
              className="h-6 w-6 text-violet-600 dark:text-violet-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {isDragActive
                ? '여기에 놓으세요'
                : '비디오를 드래그하거나 클릭하여 선택'}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              MP4, MOV, WebM 등 · 최대 {MAX_UPLOAD_FILES}개 · 파일당 500MB
            </p>
          </div>
          {isUploading && (
            <p className="text-xs font-medium text-violet-600 dark:text-violet-400">
              업로드 중…
            </p>
          )}
        </div>
      </div>

      {rejectionMessage && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300"
        >
          {rejectionMessage}
        </p>
      )}

      {itemCount > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            업로드 목록 ({itemCount})
          </h3>
          <UploadFileList />
        </div>
      )}
    </section>
  );
}
