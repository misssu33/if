# Motiondot

SNS용 영상 변환·보내기(export) 워크플로우를 위한 Next.js 앱입니다.

## 구조

```
motiondot/
├── app/                  # Next.js App Router
├── components/           # UI 컴포넌트
├── features/             # 기능별 모듈 (upload, preview, export, presets, queue)
├── lib/                  # ffmpeg, workers, storage, utils
├── public/
├── temp/                 # 임시 변환 파일
├── outputs/              # 최종 결과물
├── presets/              # SNS 프리셋 JSON
├── worker/               # 병렬 처리 worker
├── scripts/
└── types/
```

## 시작하기

```bash
cd motiondot
npm install
cp .env.example .env   # 필요 시 값 수정
npm run dev
```

Redis가 필요한 작업 큐:

```bash
npm run worker
```

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run worker` | BullMQ 워커 |
