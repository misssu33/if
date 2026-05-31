'use client';

import { Button } from '@/components/ui';
import { useStartExport } from '../hooks/use-start-export';

/** export 파이프라인 UI */
export function ExportPanel() {
  const { startExport, loading, canExport } = useStartExport();

  return (
    <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="mb-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        배치 변환 시작
      </h2>
      <Button
        type="button"
        disabled={!canExport || loading}
        onClick={() => void startExport()}
      >
        {loading ? '등록 중…' : '큐에 추가'}
      </Button>
    </section>
  );
}
