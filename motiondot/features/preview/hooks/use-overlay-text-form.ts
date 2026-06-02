'use client';

import { useForm } from 'react-hook-form';
import { usePreviewStore } from '../stores/use-preview-store';
import type { OverlayEditorFormValues } from '../types/overlay-editor-form';

/** 오버레이 텍스트 편집 — react-hook-form + Zustand preview store 동기화 */
export function useOverlayTextForm() {
  const headline = usePreviewStore((s) => s.headline);
  const setHeadline = usePreviewStore((s) => s.setHeadline);
  const subline = usePreviewStore((s) => s.subline);
  const setSubline = usePreviewStore((s) => s.setSubline);
  const ctaText = usePreviewStore((s) => s.ctaText);
  const setCtaText = usePreviewStore((s) => s.setCtaText);
  const badgeText = usePreviewStore((s) => s.badgeText);
  const setBadgeText = usePreviewStore((s) => s.setBadgeText);
  const activeTextLayer = usePreviewStore((s) => s.activeTextLayer);
  const setActiveTextLayer = usePreviewStore((s) => s.setActiveTextLayer);

  const form = useForm<OverlayEditorFormValues>({
    values: { headline, subline, ctaText, badgeText },
    mode: 'onChange',
  });

  return {
    form,
    activeTextLayer,
    setActiveTextLayer,
    setHeadline,
    setSubline,
    setCtaText,
    setBadgeText,
  };
}
