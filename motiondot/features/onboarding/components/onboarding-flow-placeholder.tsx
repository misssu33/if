'use client';

import { Button } from '@/components/ui';
import type { UploadIntent } from '../types';

type OnboardingFlowPlaceholderProps = {
  intent: UploadIntent;
  onBack?: () => void;
};

/** 미구현·제한된 플로우 안내 (프리즈 방지용 경량 UI) */
export function OnboardingFlowPlaceholder({
  intent,
  onBack,
}: OnboardingFlowPlaceholderProps) {
  if (intent === 'video') {
    return (
      <aside
        className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/60 dark:bg-amber-950/30 sm:p-5"
        role="status"
      >
        <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-100">
          Video to GIF — 준비 중
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
          서버 배치 변환(FFmpeg·큐) 워크플로는 곧 연결됩니다. 지금은 앱이 멈추지
          않도록 업로드 대신 이 안내 화면을 표시합니다.
        </p>
        <p className="mt-2 text-xs text-amber-800/80 dark:text-amber-300/80">
          이미지 → 모션 템플릿 또는 «템플릿으로 시작» 샘플은 지금 바로 사용할 수
          있습니다.
        </p>
        {onBack && (
          <Button type="button" variant="secondary" className="mt-4 w-full sm:w-auto" onClick={onBack}>
            랜딩으로 돌아가기
          </Button>
        )}
      </aside>
    );
  }

  if (intent === 'template') {
    return (
      <aside
        className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-5"
        role="status"
      >
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          아래에서 SNS 프리셋과 모션 템플릿을 선택하세요. 미디어 없이도 3단계
          미리보기까지 진행할 수 있습니다.
        </p>
      </aside>
    );
  }

  return null;
}
