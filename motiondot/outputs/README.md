# outputs/

렌더·변환이 끝난 최종 파일만 둡니다. Git에는 폴더 구조만 포함됩니다.

| 하위 폴더 | 용도 |
|-----------|------|
| `gif/` | 최종 GIF |
| `mp4/` | 최종 MP4 |
| `webp/` | 최종 WebP |

코드에서 경로는 `lib/storage/paths.ts`의 `getOutputGifDir()`, `getOutputMp4Dir()`, `getOutputWebpDir()`를 사용합니다.
