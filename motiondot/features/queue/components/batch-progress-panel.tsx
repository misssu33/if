'use client';

import { useShallow } from 'zustand/react/shallow';
import { useConversionStore } from '../stores/use-conversion-store';
import { useBatchConversionActions } from '../hooks/use-batch-conversion-actions';
import { BatchProgressSummary } from './batch-progress-summary';
import { ConversionFileRow } from './conversion-file-row';

/** 배치 변환 진행률 (실시간 폴링) */
export function BatchProgressPanel() {
  const jobs = useConversionStore(
    useShallow((s) => s.jobs.filter((j) => !j.localId)),
  );
  const batch = useConversionStore((s) => s.batch);
  const { cancelJob, retryJob } = useBatchConversionActions();

  return (
    <section className="flex min-w-0 flex-col gap-4 min-w-0 rounded-xl border border-zinc-200 p-4 sm:p-6 dark:border-zinc-800">
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
          업로드가 완료되면 비디오가 자동으로 큐에 등록됩니다.
        </p>
      )}
    </section>
  );
}
