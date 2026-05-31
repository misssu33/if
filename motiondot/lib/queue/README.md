# lib/queue/

BullMQ **Queue 클라이언트** (API 전용). Worker는 `worker/`에 있습니다.

| Module | 역할 |
|--------|------|
| `client.ts` | Queue 싱글톤 |
| `batch.ts` | 단일/배치 job 등록 |
| `progress.ts` | Redis 진행률 |
| `job-options.ts` | 재시도·보관 정책 |

## 배치 플로우

```
POST /api/jobs/batch → enqueueBatchConvertJobs()
       → Redis (BullMQ)
       → worker/index.ts → thread-pool → FFmpeg
```
