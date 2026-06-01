'use client';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** 앱 전역 오류 fallback */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body className="bg-zinc-950 text-zinc-100">
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
          <section className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm font-medium text-amber-400">예상치 못한 오류</p>
            <h1 className="mt-2 text-xl font-semibold">앱을 계속 실행할 수 없습니다.</h1>
            <p className="mt-3 text-sm text-zinc-300">
              문제가 반복되면 브라우저를 새로고침하거나 잠시 후 다시 접속해 주세요.
            </p>
            {error.message ? (
              <p className="mt-4 rounded-lg bg-zinc-800 p-3 text-xs text-zinc-200">
                {error.message}
              </p>
            ) : null}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                onClick={reset}
              >
                다시 시도
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-700 px-4 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
                onClick={() => window.location.assign('/')}
              >
                홈으로 이동
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
