'use client';

import { Button } from '@/components/ui';

type PreviewFallbackProps = {
  title: string;
  description: string;
  onBack?: () => void;
};

/** 미리보기 데이터 없음 / 로딩 */
export function PreviewFallback({
  title,
  description,
  onBack,
}: PreviewFallbackProps) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg bg-zinc-900 p-4 text-center">
      <p className="text-sm font-medium text-zinc-200">{title}</p>
      <p className="max-w-sm text-xs text-zinc-400">{description}</p>
      {onBack && (
        <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={onBack}>
          랜딩으로 돌아가기
        </Button>
      )}
    </div>
  );
}
