/** 워커 Redis 설정 */
export const redisConnection = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379),
};

export const QUEUE_NAME = 'motiondot-jobs';
