'use client';

import dynamic from 'next/dynamic';
import type { MotionCompositionProps } from '@/types/motion-template';

const RemotionPlayer = dynamic(
  () => import('./preview-player-inner').then((m) => m.PreviewPlayerInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-zinc-900 text-sm text-zinc-400">
        미리보기 로딩…
      </div>
    ),
  },
);

type PreviewPlayerProps = {
  inputProps: MotionCompositionProps;
  loop?: boolean;
};

/** Remotion 실시간 미리보기 */
export function PreviewPlayer({ inputProps, loop }: PreviewPlayerProps) {
  return <RemotionPlayer inputProps={inputProps} loop={loop} />;
}
