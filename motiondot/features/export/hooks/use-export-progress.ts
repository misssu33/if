'use client';

import { useEffect, useMemo } from 'react';
import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import { useExportProgressStore } from '../stores/use-export-progress-store';
import {
  displayProgressForStage,
  resolveExportStageFromJobs,
} from '../utils/map-export-stage';
import {
  EXPORT_STAGE_LABELS,
  type ExportStage,
} from '../types/export-progress';

function formatEta(seconds: number): string | null {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  if (seconds < 60) return `약 ${Math.ceil(seconds)}초 남음`;
  const min = Math.ceil(seconds / 60);
  return `약 ${min}분 남음`;
}

/** Export 진행 UI — conversion 큐 실시간 진행률 + 단계별 표시 */
export function useExportProgress() {
  const session = useExportProgressStore((s) => s.session);
  const activeBatchId = useExportProgressStore((s) => s.activeBatchId);
  const startedAt = useExportProgressStore((s) => s.startedAt);
  const simulatedFloor = useExportProgressStore((s) => s.simulatedFloor);
  const enqueueError = useExportProgressStore((s) => s.enqueueError);
  const isBlockingExport = useExportProgressStore((s) => s.isBlockingExport);
  const setSimulatedFloor = useExportProgressStore((s) => s.setSimulatedFloor);
  const markSuccess = useExportProgressStore((s) => s.markSuccess);
  const markError = useExportProgressStore((s) => s.markError);

  const jobs = useConversionStore((s) => s.jobs);
  const batch = useConversionStore((s) => s.batch);

  const exportJobs = useMemo(() => {
    if (!activeBatchId) return [];
    return jobs.filter((j) => j.batchId === activeBatchId && !j.localId);
  }, [jobs, activeBatchId]);

  const realProgress = useMemo(() => {
    if (exportJobs.length === 0) return 0;
    const sum = exportJobs.reduce((acc, j) => acc + j.progress, 0);
    return Math.round(sum / exportJobs.length);
  }, [exportJobs]);

  const primaryMessage = useMemo(
    () =>
      exportJobs.find((j) => j.status === 'processing' && j.message)?.message ??
      exportJobs.find((j) => j.message)?.message,
    [exportJobs],
  );

  const stage: ExportStage = useMemo(
    () => resolveExportStageFromJobs(exportJobs, session),
    [exportJobs, session],
  );

  const displayProgress = useMemo(
    () => displayProgressForStage(stage, realProgress, simulatedFloor),
    [stage, realProgress, simulatedFloor],
  );

  const statusText = useMemo(() => {
    if (session === 'error' && enqueueError) return enqueueError;
    if (primaryMessage) return primaryMessage;
    if (stage === 'idle') return '';
    return EXPORT_STAGE_LABELS[stage];
  }, [session, enqueueError, primaryMessage, stage]);

  const etaLabel = useMemo(() => {
    if (session !== 'running' || !startedAt || displayProgress < 8) {
      return null;
    }
    const elapsedSec = (Date.now() - startedAt) / 1000;
    const rate = displayProgress / elapsedSec;
    if (rate <= 0) return null;
    const remainingSec = (100 - displayProgress) / rate;
    return formatEta(remainingSec);
  }, [session, startedAt, displayProgress]);

  const failedJobs = exportJobs.filter((j) => j.status === 'failed');
  const isVisible =
    session !== 'idle' ||
    isBlockingExport ||
    stage === 'completed' ||
    stage === 'failed';

  // 큐 등록 직후·서버 응답 전 단계적 시뮬레이션 (0–14%)
  useEffect(() => {
    if (session !== 'running') return;
    if (realProgress >= 15) return;

    const id = window.setInterval(() => {
      const current = useExportProgressStore.getState().simulatedFloor;
      if (current < 14) {
        setSimulatedFloor(current + 1);
      }
    }, 450);

    return () => window.clearInterval(id);
  }, [session, realProgress, setSimulatedFloor]);

  // 배치 종료 감지 → success / error
  useEffect(() => {
    if (session !== 'running' || exportJobs.length === 0) return;

    const active = exportJobs.filter(
      (j) =>
        j.status === 'queued' ||
        j.status === 'processing' ||
        j.status === 'pending',
    );
    const failed = exportJobs.filter((j) => j.status === 'failed');
    const completed = exportJobs.filter((j) => j.status === 'completed');

    if (active.length > 0) return;

    if (failed.length > 0) {
      const firstError = failed.find((j) => j.error)?.error;
      markError(firstError ?? '일부 파일 변환에 실패했습니다.');
      return;
    }

    if (completed.length === exportJobs.length) {
      markSuccess();
    }
  }, [session, exportJobs, markSuccess, markError]);

  return {
    session,
    stage,
    displayProgress,
    statusText,
    etaLabel,
    isVisible,
    isBlockingExport,
    isRunning: session === 'running',
    isSuccess: session === 'success' || stage === 'completed',
    isFailed: session === 'error' || stage === 'failed',
    failedJobs,
    exportJobs,
    batchId: activeBatchId ?? batch.batchId,
    completedCount: exportJobs.filter((j) => j.status === 'completed').length,
    totalCount: exportJobs.length,
  };
}
