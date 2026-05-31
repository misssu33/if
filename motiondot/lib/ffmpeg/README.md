# lib/ffmpeg/

모든 FFmpeg 로직. 포맷별 파일 분리.

| File | 역할 |
|------|------|
| `convert.ts` | 포맷 디스패치 |
| `gif.ts` | GIF · 팔레트 · FPS · 해상도 |
| `mp4.ts` | H.264 · CRF · preset |
| `webp.ts` | libwebp · quality |
| `quality.ts` | low / medium / high 매핑 |
| `filters.ts` | scale · pad · fps |
| `run-command.ts` | fluent-ffmpeg Promise |

## ConvertOptions

- `width`, `height`, `fps` — 해상도·프레임레이트
- `quality` — `low` \| `medium` \| `high` (기본 medium)
