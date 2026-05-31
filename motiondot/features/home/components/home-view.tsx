import { PageShell } from '@/components/ui';

export function HomeView() {
  return (
    <PageShell>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-16 sm:px-16">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Motiondot
        </h1>
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          SNS용 영상 변환·export 워크플로우
        </p>
      </main>
    </PageShell>
  );
}
