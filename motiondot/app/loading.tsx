/** 루트 페이지 전환/초기 로드 fallback */
export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      </section>
    </main>
  );
}
