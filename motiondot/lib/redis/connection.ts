import type { ConnectionOptions } from 'bullmq';

export type RedisHostConfig = {
  host: string;
  port: number;
};

/** ioredis / 공용 호스트 설정 */
export function getRedisHostConfig(): RedisHostConfig {
  return {
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
  };
}

/** BullMQ connection 옵션 */
export function getRedisConnection(): ConnectionOptions {
  return getRedisHostConfig();
}
