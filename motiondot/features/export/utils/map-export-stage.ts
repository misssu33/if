import type { ConversionFileStatus } from '@/features/queue/types';
import type { ExportStage } from '../types/export-progress';

/** 서버 진행률(0–100) → 표시 단계 */
export function stageFromProgress(progress: number): ExportStage {
  if (progress >= 100) return 'completed';
  if (progress >= 90) return 'optimizing';
  if (progress >= 65) return 'encoding';
  if (progress >= 15) return 'rendering';
  return 'preparing';
}

/** FFmpeg 메시지가 있으면 인코딩 단계로 보정 */
export function refineStageFromMessage(
  stage: ExportStage,
  message?: string,
): ExportStage {
  if (!message) return stage;
  const lower = message.toLowerCase();
  if (lower.includes('ffmpeg') || lower.includes('인코딩')) {
    return progressStageAtLeast(stage, 'encoding');
  }
  if (lower.includes('temp') || lower.includes('워크스페이스') || lower.includes('확인')) {
    return progressStageAtLeast(stage, 'preparing');
  }
  return stage;
}

function progressStageAtLeast(
  current: ExportStage,
  min: ExportStage,
): ExportStage {
  const order: ExportStage[] = [
    'idle',
    'preparing',
    'rendering',
    'encoding',
    'optimizing',
    'completed',
  ];
  const ci = order.indexOf(current);
  const mi = order.indexOf(min);
  return ci >= mi ? current : min;
}

/** 배치 작업 상태 요약 → UI 단계 */
export function resolveExportStageFromJobs(
  jobs: { status: ConversionFileStatus; progress: number; message?: string }[],
  session: 'idle' | 'running' | 'success' | 'error',
): ExportStage {
  if (session === 'idle') return 'idle';
  if (jobs.length === 0) {
    return session === 'error' ? 'failed' : 'preparing';
  }

  const active = jobs.filter(
    (j) =>
      j.status === 'queued' ||
      j.status === 'processing' ||
      j.status === 'pending',
  );
  const failed = jobs.filter((j) => j.status === 'failed');
  const completed = jobs.filter((j) => j.status === 'completed');

  if (session === 'error' || (failed.length > 0 && active.length === 0)) {
    return 'failed';
  }
  if (
    session === 'success' ||
    (completed.length === jobs.length && jobs.length > 0)
  ) {
    return 'completed';
  }

  const avgProgress =
    jobs.reduce((sum, j) => sum + j.progress, 0) / jobs.length;
  const maxProgress = Math.max(...jobs.map((j) => j.progress), 0);
  const progress = Math.max(avgProgress, maxProgress);
  const primaryMessage = jobs.find((j) => j.message)?.message;

  let stage = stageFromProgress(progress);
  stage = refineStageFromMessage(stage, primaryMessage);

  if (active.length > 0 && progress < 15) {
    return 'preparing';
  }

  return stage;
}

/** 표시용 진행률 (단계별 최소값 보장) */
export function displayProgressForStage(
  stage: ExportStage,
  realProgress: number,
  simulatedFloor: number,
): number {
  if (stage === 'completed') return 100;
  if (stage === 'failed') return Math.min(99, Math.max(realProgress, simulatedFloor));
  if (stage === 'idle') return 0;

  const floors: Record<ExportStage, number> = {
    idle: 0,
    preparing: 0,
    rendering: 15,
    encoding: 65,
    optimizing: 90,
    completed: 100,
    failed: 0,
  };

  const raw = Math.max(realProgress, simulatedFloor, floors[stage]);
  if (stage === 'optimizing') return Math.min(99, Math.max(90, raw));
  return Math.min(99, raw);
}
