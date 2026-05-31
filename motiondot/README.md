# Motiondot

SNS 영상 변환·export — Next.js (App Router, TypeScript, Tailwind, **no `src/`**).

## 구조

```
motiondot/
├── app/
├── components/
├── features/         # upload, preview, export, presets, queue
├── lib/              # ffmpeg, workers, storage, utils
├── public/
├── temp/
│   ├── frames/       # 프레임 추출
│   ├── gif/          # GIF 중간파일
│   └── archive/      # 압축파일
├── outputs/
│   ├── gif/          # 최종 GIF
│   ├── mp4/          # 최종 MP4
│   └── webp/         # 최종 WebP
├── presets/          # SNS 프리셋 JSON
├── worker/
├── scripts/
└── types/
```

## 시작하기

```bash
cd motiondot
npm install
cp .env.example .env
npm run dev
```

## Android (Termux)

```
/storage/emulated/0/Projects/motiondot
```

`.env`의 `PROJECT_ROOT`를 위 경로로 설정합니다.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run worker` | BullMQ 워커 (Redis 필요) |

## Cursor

프로젝트 규칙: [`.cursor/rules/project.mdc`](../.cursor/rules/project.mdc)
