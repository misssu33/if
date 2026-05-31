'use client';

import { useFileDropzone } from '../hooks/use-file-dropzone';

/** 드래그 앤 드롭 업로드 UI */
export function UploadZone() {
  const { getRootProps, getInputProps, isDragActive } = useFileDropzone();

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
          : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700'
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        영상·이미지를 드래그하거나 클릭하여 업로드
      </p>
    </div>
  );
}
