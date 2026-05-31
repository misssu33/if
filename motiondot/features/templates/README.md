# MotionDot 광고 모션 템플릿 엔진

- **JSON**: `/templates/*.json` — 레이아웃·타이밍·타이포·테마
- **코드**: `features/templates/` — Remotion 렌더·애니메이션·컴포넌트
- **미리보기 UI**: `features/preview/` — Player만 담당 (렌더 로직 없음)
- **FFmpeg export**: `lib/ffmpeg/` + `worker/` — 모션 렌더와 분리

## 확장

`engine/timeline-builder.ts`의 `TimelineTrack`으로 향후 타임라인 에디터 연동 가능.
