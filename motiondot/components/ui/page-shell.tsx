import type { ReactNode } from 'react';

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

/** 공유 레이아웃 셸 — feature 페이지에서 재사용 */
export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div
      className={`flex min-h-full flex-1 flex-col bg-zinc-50 font-sans dark:bg-black ${className}`}
    >
      {children}
    </div>
  );
}
