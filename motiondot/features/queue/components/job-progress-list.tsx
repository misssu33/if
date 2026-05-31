'use client';

import { ProgressBar } from '@/components/feedback/progress-bar';

type JobItem = {
  jobId: string;
  label: string;
  progress: number;
  status: string;
};

type JobProgressListProps = {
  jobs: JobItem[];
};

/** 배치 작업 진행률 목록 */
export function JobProgressList({ jobs }: JobProgressListProps) {
  if (jobs.length === 0) {
    return (
      <p className="text-sm text-zinc-500">대기 중인 작업이 없습니다.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {jobs.map((job) => (
        <li key={job.jobId} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {job.label}
            </span>
            <span className="text-zinc-500">{job.status}</span>
          </div>
          <ProgressBar value={job.progress} />
        </li>
      ))}
    </ul>
  );
}
