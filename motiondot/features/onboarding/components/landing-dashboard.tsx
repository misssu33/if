'use client';

import { Button } from '@/components/ui';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import { OnboardingCtaCard } from './onboarding-cta-card';
import { SampleProjectsGrid } from './sample-projects-grid';
import { useApplySampleProject } from '../hooks/use-apply-sample-project';

/** TikTok 제휴 크리에이터용 랜딩 */
export function LandingDashboard() {
  const startFlow = useOnboardingStore((s) => s.startFlow);
  const applySample = useApplySampleProject();

  return (
    <div className="mx-auto flex w-full min-w-0 flex-col gap-8 py-4 sm:gap-10">
      <section className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-400">
          TikTok Affiliate · 9:16
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          TikTok 제휴 숏폼 광고, 모바일에서 바로
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
          제품 영상·이미지로 9:16 꿀템·후기·훅 템플릿을 고르고 GIF·MP4·WebP로
          빠르게 반복 export 하세요. 쿠팡 상세 GIF도 보조로 지원합니다.
        </p>
        <Button
          type="button"
          className="mt-6 min-h-11"
          onClick={() => startFlow('video')}
        >
          TikTok 제휴 3단계 시작
        </Button>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          무엇부터 만들까요?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <OnboardingCtaCard
            icon="🎬"
            title="제품 영상 업로드"
            description="9:16 TikTok·Reels용 GIF/MP4/WebP 배치 변환"
            onClick={() => startFlow('video')}
          />
          <OnboardingCtaCard
            icon="🖼️"
            title="제품 이미지 업로드"
            description="모바일 미리보기 · 숏폼 템플릿 오버레이"
            onClick={() => startFlow('image')}
          />
          <OnboardingCtaCard
            icon="✨"
            title="템플릿부터 선택"
            description="꿀템·후기·훅 등 TikTok 제휴 9:16"
            onClick={() => startFlow('template')}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          TikTok 제휴 샘플
        </h2>
        <p className="mb-4 text-xs text-zinc-500">
          탭하면 TikTok 9:16 프리셋·템플릿이 자동 적용됩니다.
        </p>
        <SampleProjectsGrid onSelect={applySample} />
      </section>
    </div>
  );
}
