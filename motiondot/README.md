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
│   ├── frames/           # 프레임 추출
│   ├── gif/              # GIF 생성 중간파일
│   └── archive/          # 압축파일
├── outputs/              # 최종 결과물
│   ├── gif/              # 최종 GIF
│   ├── mp4/              # 최종 MP4
│   └── webp/             # 최종 WebP
├── presets/              # SNS 프리셋 JSON
├── worker/               # 병렬 처리 worker
├── scripts/
└── types/
```

## Android (Termux)

기기에서 프로젝트 루트:

```
/storage/emulated/0/Projects/motiondot
```

`.env`의 `PROJECT_ROOT`가 위 경로를 가리키면 `temp/`, `outputs/`, `presets/`가 해당 루트 기준으로 해석됩니다 (`lib/storage/paths.ts`).

```bash
cd /storage/emulated/0/Projects/motiondot
npm install
cp .env.example .env
npm run dev
```

## 시작하기

```bash
cd motiondot
npm install
cp .env.example .env   # 필요 시 값 수정
npm run dev
```

로컬 PC에서 개발할 때는 `PROJECT_ROOT`를 비우거나 주석 처리하면 `process.cwd()`가 루트로 사용됩니다.

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
