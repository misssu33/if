/** Export UI 단계 (사용자 표시용) */
export type ExportStage =
  | 'idle'
  | 'preparing'
  | 'rendering'
  | 'encoding'
  | 'optimizing'
  | 'completed'
  | 'failed';

export const EXPORT_STAGE_LABELS: Record<
  Exclude<ExportStage, 'idle'>,
  string
> = {
  preparing: '준비 중',
  rendering: '렌더링 중',
  encoding: '인코딩 중',
  optimizing: '최적화 중',
  completed: '완료',
  failed: '실패',
};
