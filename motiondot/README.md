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
