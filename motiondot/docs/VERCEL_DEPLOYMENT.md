# MotionDot Vercel Deployment Guide

## 1) 배포 전 준비

- Node.js 20 이상 사용
- Redis 연결 정보 준비 (BullMQ queue/progress 저장용)
- 프로젝트 루트에 `.env` 설정

필수 환경 변수 예시:

```bash
REDIS_HOST=<your-redis-host>
REDIS_PORT=<your-redis-port>
PROJECT_ROOT=/var/task
TEMP_DIR=/tmp/motiondot-temp
OUTPUT_DIR=/tmp/motiondot-outputs
PRESETS_DIR=presets

FREE_TIER_MAX_BATCH_JOBS=3
FREE_TIER_MAX_WIDTH=1280
FREE_TIER_MAX_HEIGHT=720
FREE_TIER_WATERMARK_TEXT=MotionDot Free
```

## 2) Vercel 프로젝트 생성

1. Vercel 대시보드에서 Git 저장소 연결
2. Framework Preset: `Next.js`
3. Root Directory: `motiondot`
4. Build Command: `npm run build`
5. Install Command: `npm install`
6. Output Directory: 기본값 사용

## 3) 환경 변수 등록

Vercel Project Settings > Environment Variables에 `.env` 값을 동일하게 등록합니다.

- Preview/Production 둘 다 등록
- Redis는 TLS/인증이 필요한 경우 provider 가이드를 따릅니다.

## 4) 런타임 고려사항

- 변환 결과물은 임시 파일시스템을 사용하므로 `TEMP_DIR`, `OUTPUT_DIR`를 `/tmp` 하위 경로로 지정합니다.
- 장기 보관 다운로드가 필요하면 추후 S3/R2 같은 object storage 연동을 권장합니다.
- 현재 MVP는 로그인/결제 없이 tier 헤더 기반 정책으로 동작합니다.

## 5) 배포 후 점검

1. `/` 접속 확인
2. 업로드 → 변환 → 다운로드 플로우 점검
3. `/sitemap.xml`, `/robots.txt` 응답 점검
4. Open Graph 미리보기 점검 (og-image placeholder)
5. free-tier 제한(해상도/배치수) 및 워터마크 적용 점검

## 6) 권장 운영 설정

- Vercel Analytics/Speed Insights 활성화
- Error Tracking(Sentry 등) 연동
- Redis 모니터링 알람 설정
