'use client';

import { useCallback } from 'react';
import type { TextOverlayLayerId } from '../types/text-overlay-layer';

/** 미리보기 탭 후 해당 레이어 입력으로 스크롤·포커스 */
export function useFocusOverlayInput() {
  return useCallback((layerId: TextOverlayLayerId) => {
    const el = document.querySelector<HTMLElement>(
      `[data-overlay-input="${layerId}"]`,
    );
    if (!el) return;
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.focus({ preventScroll: true });
    }
  }, []);
}
