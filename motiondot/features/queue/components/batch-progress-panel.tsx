'use client';

import { useConversionStore } from '../stores/use-conversion-store';
import { useConversionSync } from '../hooks/use-conversion-sync';
import { useSyncUploadFiles } from '../hooks/use-sync-upload-files';
import { useBatchConversionActions } from '../hooks/use-batch-conversion-actions';
import { BatchProgressSummary } from './batch-progress-summary';
import { ConversionFileRow } from './conversion-file-row';

/** 배치 변환 진행률 패널 (상태 · 폴링 · 액션) */
export function BatchProgressPanel() {
  useSyncUploadFiles();
  useConversionSync();

  const jobs = useConversionStore((s) => s.jobs);
  const batch = useConversionStore((s) => s.batch);
  const { cancelJob, retryJob } = useBatchConversionActions();

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        변환 진행률
      </h2>

      <BatchProgressSummary batch={batch} />

      {jobs.length > 0 ? (
        <ul className="flex flex-col gap-3" aria-label="파일별 변환 진행률">
          {jobs.map((job) => (
            <ConversionFileRow
              key={job.jobId}
              job={job}
              onCancel={cancelJob}
              onRetry={retryJob}
            />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">
          업로드 후 배치 변환을 시작하면 진행률이 표시됩니다.
        </p>
      )}
    </section>
  );
}
