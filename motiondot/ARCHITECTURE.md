# MotionDot — Production Architecture

배치 GIF / MP4 / WebP 변환기 (TikTok, Instagram Reels, Threads, Coupang, 크리에이터용).

## Tech stack

| Layer | Technology |
|-------|------------|
| App | Next.js (App Router), TypeScript, Tailwind |
| State | Zustand (`stores/`, `features/*/stores/`) |
| Media | fluent-ffmpeg, ffmpeg-static (`lib/ffmpeg/`) |
| Queue | BullMQ + Redis (`lib/queue/`, `worker/`) |
| Preview | Remotion (`features/preview/remotion/`) |

## Directory map

```
motiondot/
├── app/                    # App Router — 얇은 page.tsx, API 라우트만
│   ├── page.tsx
│   └── api/                # upload, jobs, progress, health
├── components/             # 공유 UI (feature 간 중복 금지)
│   ├── ui/
│   ├── layout/
│   └── feedback/
├── features/               # 기능 단위 모듈 (격리)
│   ├── workspace/          # 메인 화면 조합
│   ├── upload/             # 업로드 파이프라인
│   ├── templates/          # 광고 모션 템플릿 엔진
│   ├── preview/            # Remotion 미리보기 UI
│   ├── export/             # outputs/ 저장 파이프라인
│   ├── presets/            # JSON 프리셋 UI·로더
│   └── queue/              # 진행률 UI
├── lib/
│   ├── ffmpeg/             # FFmpeg 전용 (유일한 진입점)
│   ├── queue/              # BullMQ Queue 클라이언트 (API)
│   ├── redis/              # Redis 연결
│   └── storage/            # temp/outputs 경로
├── worker/                 # BullMQ Worker + processors
├── presets/                # SNS export 프리셋 JSON
├── templates/              # 광고 모션 템플릿 JSON
├── stores/                 # 전역 Zustand
├── types/                  # 공유 TypeScript 타입
├── temp/                   # frames, gif, archive
├── outputs/                # gif, mp4, webp 최종물
└── scripts/
```

## Data flow

1. **Upload** — `UploadZone` → `POST /api/upload` → `temp/archive/`
2. **Preset** — `presets/*.json` → `PresetSelector` → Zustand
3. **Queue** — `POST /api/jobs` → BullMQ → `worker/processors/`
4. **Convert** — `lib/ffmpeg` → `outputs/{format}/`
5. **Progress** — Worker → Redis → `GET /api/jobs/progress` → UI

## Rules

- Feature-based folders; no monolithic `page.tsx`
- FFmpeg only in `lib/ffmpeg/`
- Workers only in `worker/`
- Presets only as JSON in `presets/`
- Tailwind only; strict TypeScript

See also: `.cursor/rules/project.mdc`
