# MotionDot 광고 모션 템플릿 엔진

## 아키텍처

```
templates/*.json          ← 선언적 정의 (layout, timing, theme)
        ↓ loadMotionTemplate()
features/templates/       ← 렌더 엔진 (Remotion, 애니메이션, 컴포넌트)
        ↓ buildCompositionProps()
features/preview/         ← UI (Player만)
lib/ffmpeg/ + worker/     ← 최종 GIF/MP4/WebP (모션과 분리)
```

## 레이어

| 레이어 | 역할 |
|--------|------|
| JSON (`/templates`) | 레이아웃·타이밍·타이포·색상·미디어 위치 |
| `animation/` | fade, slide-up, zoom, pop, glow, shake, loop-pulse |
| `components/` | AnimatedText, AnimatedCTA, AnimatedMedia, AnimatedBadge, MotionContainer |
| `engine/` | resolve, timeline-builder, buildCompositionProps |
| `layouts/` | AdTemplateLayout — JSON → 레이어 트리 |
| `remotion/` | AdMotionComposition |
| `server/` | load-template, list (presets 패턴 재사용) |

## 타임라인 확장

`TimelineTrack[]` + `timeline-builder.ts`로 향후 비주얼 타임라인 에디터 연동.

## 스타터 템플릿 (7)

1. tiktok-product-hook
2. coupang-discount-gif
3. before-after
4. product-review-highlight
5. flash-sale-banner
6. lifestyle-promo
7. sns-story-loop
