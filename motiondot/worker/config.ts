/** worker_threads 풀 크기 (FFmpeg 동시 실행) */
export const WORKER_THREAD_COUNT = Number(process.env.WORKER_THREADS ?? 2);

/** BullMQ Worker 동시 job 수 */
export const BULLMQ_CONCURRENCY = Number(process.env.BULLMQ_CONCURRENCY ?? 2);
