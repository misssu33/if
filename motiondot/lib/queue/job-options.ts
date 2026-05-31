/** BullMQ 기본 작업 옵션 */
export const DEFAULT_JOB_OPTIONS = {
  attempts: 2,
  backoff: { type: 'exponential' as const, delay: 3000 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
};
