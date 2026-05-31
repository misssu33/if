# features/queue/

배치 변환 **실시간 진행률** · Zustand 상태 · 취소/재시도.

## Store (`useConversionStore`)

- `jobs` — 파일별 status / progress / error / output
- `batch` — 전체 진행 요약
- `uploadFiles` — 업로드 파일 스냅샷

## Status (파일별)

`pending` · `queued` · `processing` · `completed` · `failed` · `cancelled`

## Transport (SSE/WS 대비)

```typescript
import { createPollingTransport, createSseTransport } from '@/features/queue';

useConversionSync({ transport: createSseTransport() }); // 추후 SSE
```

## API

| Route | 역할 |
|-------|------|
| `GET /api/jobs/batch/progress?batchId=` | 배치 전체 진행 |
| `POST /api/jobs/[jobId]/cancel` | 취소 |
| `POST /api/jobs/[jobId]/retry` | 재시도 |

## UI

`BatchProgressPanel` — workspace에서 사용 (page.tsx에 로직 없음)
