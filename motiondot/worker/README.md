# worker/

BullMQ Worker + **worker_threads** FFmpeg 풀.

```
worker/index.ts          # BullMQ (concurrency)
  └─ processors/convert-job.ts
       └─ pool/thread-pool.ts
            └─ threads/convert.worker.ts
                 └─ processors/convert-runner.ts → lib/ffmpeg
```

## 환경 변수

| 변수 | 기본 | 설명 |
|------|------|------|
| `WORKER_THREADS` | 2 | FFmpeg worker_thread 수 |
| `BULLMQ_CONCURRENCY` | 2 | 동시 BullMQ job 수 |
| `REDIS_HOST` | 127.0.0.1 | Redis |
| `REDIS_PORT` | 6379 | Redis |

```bash
npm run worker
```
