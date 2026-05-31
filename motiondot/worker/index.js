/**
 * BullMQ 병렬 처리 워커 (Redis 필요)
 * 실행: npm run worker
 */
const { REDIS_HOST = '127.0.0.1', REDIS_PORT = '6379' } = process.env;

console.log(`[worker] Redis ${REDIS_HOST}:${REDIS_PORT} — 큐 구현 예정`);
