/** MotionDot 큐 이름 상수 */
export const MOTIONDOT_QUEUE_NAME = 'motiondot-convert';

export const JOB_NAMES = {
  CONVERT: 'convert',
} as const;

export type JobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES];
