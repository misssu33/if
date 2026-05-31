# temp/

변환·렌더 과정에서만 쓰는 임시 파일입니다. Git에는 폴더 구조만 포함되며, 파일 내용은 커밋하지 않습니다.

| 하위 폴더 | 용도 |
|-----------|------|
| `frames/` | 영상에서 추출한 프레임 이미지 (PNG/JPEG 시퀀스) |
| `gif/` | GIF 생성 중간파일 (팔레트, 중간 GIF, 프레임 버퍼) |
| `archive/` | zip 등 압축·패키징 임시 파일 |

코드에서 경로는 `lib/storage/paths.ts`의 `getTempFramesDir()`, `getTempGifDir()`, `getTempArchiveDir()`를 사용합니다.
