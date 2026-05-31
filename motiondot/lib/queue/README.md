# lib/queue/

BullMQ **Queue 클라이언트** (API 전용). Worker는 `worker/`에 있습니다.

## 큐 이름 (`config.ts`)

| 상수 | BullMQ 큐 이름 | 용도 |
|------|----------------|------|
| `QUEUE_NAMES.UPLOAD` | `upload_queue` | 업로드 후처리 (예약) |
| `QUEUE_NAMES.EXPORT` | `export_queue` | FFmpeg 변환·보내기 |
| `QUEUE_NAMES.RENDER` | `render_queue` | Remotion 렌더 (예약) |

큐 이름에는 콜론(`:`)·하이픈을 사용하지 않습니다.

## 배치 플로우

```
POST /api/jobs/batch → enqueueBatchConvertJobs() → export_queue
       → Redis (BullMQ)
       → worker/index.ts (export_queue) → thread-pool → FFmpeg
```
