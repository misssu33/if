# app/

Next.js App Router. `page.tsx`는 feature view만 import합니다. 비즈니스 로직은 `features/`에 둡니다.

## api/

| Route | 역할 |
|-------|------|
| `health` | 헬스체크 |
| `upload` | 파일 → temp/archive |
| `jobs` | BullMQ 작업 등록 |
| `jobs/progress` | Redis 진행률 조회 |
