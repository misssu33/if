# MotionDot

TikTok · Instagram Reels · Threads · Coupang · 크리에이터용 **배치 GIF/MP4/WebP** 변환기.

## Stack

Next.js · TypeScript · Tailwind · Zustand · ffmpeg · BullMQ · Redis · Remotion

## Quick start

```bash
npm install
cp .env.example .env
npm run ensure-dirs
npm run dev          # http://localhost:3000
npm run worker       # 별도 터미널, Redis 필요
```

## Architecture

전체 구조는 **[ARCHITECTURE.md](./ARCHITECTURE.md)** 참고.

```
features/     → upload · preview · export · presets · queue · workspace
lib/ffmpeg/   → 미디어 처리 (유일)
worker/       → BullMQ 배치 처리
presets/      → SNS JSON
temp/         → 중간 파일
outputs/      → 최종 GIF · MP4 · WebP
```

## Cursor

`.cursor/rules/project.mdc`

## MVP (모바일 · GIF 워크플로)

- 모바일: `AppShell` 사이드 드로어 + 반응형 3단계 워크스페이스
- GIF: 업로드 → BullMQ → FFmpeg → `outputs/gif/` → 미리보기/다운로드 ([E2E 가이드](docs/E2E_CONVERT_TEST.md))

## E2E 변환 테스트

전체 파이프라인(업로드 → 큐 → FFmpeg → GIF → 미리보기 → 다운로드): [docs/E2E_CONVERT_TEST.md](docs/E2E_CONVERT_TEST.md)

```bash
redis-server && npm run worker   # 별도 터미널
npm run test:e2e
npm run test:e2e -- ./your-sample.mp4
```
