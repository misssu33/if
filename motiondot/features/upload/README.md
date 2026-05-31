# features/upload/

**react-dropzone** 기반 다중 비디오 드래그 앤 드롭 업로드.

## 구조

| Path | 역할 |
|------|------|
| `components/upload-zone.tsx` | 드롭존 UI |
| `components/upload-file-list.tsx` | 업로드 목록 |
| `hooks/use-file-dropzone.ts` | dropzone 설정 (video only, multiple) |
| `hooks/use-upload-queue.ts` | 병렬 업로드 + Zustand |
| `stores/use-upload-ui-store.ts` | 큐 UI 상태 |
| `services/upload-client.ts` | XHR + 진행률 |
| `services/upload-service.ts` | 서버 저장 (`server-only`) |

## API

`POST /api/upload` — `multipart/form-data`, field `file`
