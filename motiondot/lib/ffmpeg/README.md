# lib/ffmpeg/

모든 FFmpeg 로직. `app/`, `features/`, `worker/processors/`는 이 모듈만 import합니다.

- `binary.ts` — ffmpeg-static 경로
- `encode.ts` — 공통 인코딩
- `extract-frames.ts` — temp/frames
- `gif.ts` / `mp4.ts` / `webp.ts` — 포맷별 래퍼
