'use client';

import { useUploadQueue } from '../hooks/use-upload-queue';
import { useUploadUiStore } from '../stores/use-upload-ui-store';
import { UploadFileItem } from './upload-file-item';

/** 업로드된 / 업로드 중인 비디오 목록 */
export function UploadFileList() {
  const items = useUploadUiStore((s) => s.items);
  const { removeUploadedFile } = useUploadQueue();

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2" aria-label="업로드 파일 목록">
      {items.map((item) => (
        <UploadFileItem
          key={item.localId}
          item={item}
          onRemove={() =>
            removeUploadedFile(item.localId, item.meta?.id)
          }
        />
      ))}
    </ul>
  );
}
