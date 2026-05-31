# FFmpeg 변환 파이프라인 — 로컬 테스트

## 사전 준비

```bash
cd motiondot
npm install
npm run ensure-dirs
```

## 1) 직접 변환 (Redis / Worker 불필요)

```bash
npm run test:convert
npx tsx scripts/test-convert-pipeline.ts --direct ./temp/archive/your.mp4
```

## 2) 큐 + Worker

```bash
redis-server
npm run worker   # 터미널 2
npm run test:convert:queue
```

## 3) HTTP API

`npm run dev` + worker + Redis 후 `POST /api/convert/test` — 상세는 README 참고.
