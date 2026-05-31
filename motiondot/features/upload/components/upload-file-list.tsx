'use client';

import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import { ConversionFileRow } from '@/features/queue/components/conversion-file-row';
import { useBatchConversionActions } from '@/features/queue/hooks/use-batch-conversion-actions';
import { useUploadQueue } from '../hooks/use-upload-queue';

/** 업로드·큐 통합 파이프라인 목록 (Zustand) */
export function UploadFileList() {
  const jobs = useConversionStore((s) =>
    s.jobs.filter((j) => j.localId),
  );
  const { removeUploadedFile } = useUploadQueue();
  const { cancelJob, retryJob } = useBatchConversionActions();

  if (jobs.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2" aria-label="업로드·변환 파이프라인">
      {jobs.map((job) => (
        <ConversionFileRow
          key={job.localId ?? job.jobId}
          job={job}
          onCancel={cancelJob}
          onRetry={retryJob}
          onRemove={
            job.localId
              ? () => removeUploadedFile(job.localId!, job.fileId)
              : undefined
          }
        />
      ))}
    </ul>
  );
}
