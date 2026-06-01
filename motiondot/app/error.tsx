'use client';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** 라우트 세그먼트 오류 fallback */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-rose-600">문제가 발생했습니다.</p>
        <h1 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          작업 화면을 불러오지 못했습니다.
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
          일시적인 오류일 수 있습니다. 다시 시도하거나 새로고침해 주세요.
        </p>
        {error.message ? (
          <p className="mt-4 rounded-lg bg-zinc-100 p-3 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {error.message}
          </p>
        ) : null}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            onClick={reset}
          >
            다시 시도
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            onClick={() => window.location.assign('/')}
          >
            홈으로 이동
          </button>
        </div>
      </section>
    </main>
  );
}
