'use client';

type OnboardingCtaCardProps = {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
};

/** 랜딩 CTA 카드 */
export function OnboardingCtaCard({
  title,
  description,
  icon,
  onClick,
}: OnboardingCtaCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-white p-5 text-left transition hover:border-violet-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-600"
    >
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
      <span className="text-xs text-zinc-500">{description}</span>
    </button>
  );
}
