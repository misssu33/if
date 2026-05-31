'use client';

import { usePreviewStore } from '../stores/use-preview-store';
import type { UploadFileMeta } from '@/types';

type PreviewGridProps = {
  files: UploadFileMeta[];
};

/** 업로드 파일 그리드 — 미리보기 대상 선택 */
export function PreviewGrid({ files }: PreviewGridProps) {
  const selectedFileId = usePreviewStore((s) => s.selectedFileId);
  const setSelectedFileId = usePreviewStore((s) => s.setSelectedFileId);

  if (files.length === 0) {
    return <p className="text-xs text-zinc-500">업로드된 파일이 없습니다.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {files.map((file) => {
        const active = (selectedFileId ?? files[0]?.id) === file.id;
        return (
          <li key={file.id}>
            <button
              type="button"
              onClick={() => setSelectedFileId(file.id)}
              className={`w-full rounded-lg border p-2 text-left text-xs transition-colors ${
                active
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
                  : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800'
              }`}
            >
              <span className="line-clamp-2 font-medium text-zinc-800 dark:text-zinc-200">
                {file.originalName}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
