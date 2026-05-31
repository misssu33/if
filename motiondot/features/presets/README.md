# features/presets/

SNS export 프리셋 — **FFmpeg와 분리**된 설정 계층.

## 구조

| Path | 역할 |
|------|------|
| `server/load-preset.ts` | JSON 로드 (서버) |
| `utils/resolve-export-settings.ts` | 프리셋 + overrides → `ResolvedExportSettings` |
| `stores/use-export-settings-store.ts` | Zustand 선택·덮어쓰기 |
| `components/preset-selector.tsx` | 재사용 UI (picker + summary + overrides) |

## API

- `GET /api/presets` — 목록
- `GET /api/presets/[id]` — 단일

## Custom

`custom` 프리셋 선택 시 FPS·해상도·품질·용량을 자유롭게 조정합니다.
