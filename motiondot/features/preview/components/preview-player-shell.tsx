'use client';

import type { ReactNode } from 'react';
import type { MotionCompositionProps } from '@/types/motion-template';
import { PreviewPlayer } from './preview-player';
import { PreviewTextOverlayHitLayer } from './preview-text-overlay-hit-layer';
import type { TextOverlayLayerId } from '../types/text-overlay-layer';

type PreviewPlayerShellProps = {
  inputProps: MotionCompositionProps;
  loop?: boolean;
  activeTextLayer: TextOverlayLayerId | null;
  onSelectTextLayer: (id: TextOverlayLayerId) => void;
  onClearTextLayer: () => void;
  /** 플레이어 아래·옆 UI (폼 등) */
  children?: ReactNode;
};

/** Remotion 플레이어 + 모바일 텍스트 오버레이 히트 레이어 */
export function PreviewPlayerShell({
  inputProps,
  loop,
  activeTextLayer,
  onSelectTextLayer,
  onClearTextLayer,
  children,
}: PreviewPlayerShellProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative min-w-0">
        <PreviewPlayer inputProps={inputProps} loop={loop} />
        <PreviewTextOverlayHitLayer
          layout={inputProps.template.layout}
          activeLayer={activeTextLayer}
          onSelectLayer={onSelectTextLayer}
          onClearLayer={onClearTextLayer}
        />
      </div>
      {children}
    </div>
  );
}
