'use client';

import { startTransition } from 'react';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import type { UploadIntent } from '../types';
import { OnboardingCtaCard } from './onboarding-cta-card';
import { SampleProjectsGrid } from './sample-projects-grid';
import { useApplySampleProject } from '../hooks/use-apply-sample-project';

/** 첫 방문 랜딩 대시보드 */
export function LandingDashboard() {
  const startFlow = useOnboardingStore((s) => s.startFlow);
  const applySample = useApplySampleProject();

  const enterFlow = (intent: UploadIntent) => {
    startTransition(() => {
      startFlow(intent);
    });
  };

  return (
    <div className="mx-auto flex w-full min-w-0 flex-col gap-8 py-4 sm:gap-10">
      <section className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          영상·이미지로 SNS 광고 만들기
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
          Photoshop·After Effects 없이 MP4·GIF·WebP 광고를 배치 생성하세요.
          모션 템플릿과 SNS 프리셋이 포함되어 있습니다.
        </p>
        <Button
          type="button"
          className="mt-6"
          onClick={() => enterFlow('video')}
        >
          3단계 가이드로 시작
        </Button>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          무엇을 업로드할까요?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <OnboardingCtaCard
            icon="🎬"
            title="Upload Videos"
            description="MP4·MOV로 GIF/MP4/WebP 배치 변환"
            onClick={() => enterFlow('video')}
          />
          <OnboardingCtaCard
            icon="🖼️"
            title="Upload Images"
            description="제품·배경 이미지 → 모션 템플릿"
            onClick={() => enterFlow('image')}
          />
          <OnboardingCtaCard
            icon="✨"
            title="Create from Template"
            description="TikTok·쿠팡·스토리 템플릿 선택"
            onClick={() => enterFlow('template')}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          샘플 프로젝트
        </h2>
        <p className="mb-4 text-xs text-zinc-500">
          클릭하면 프리셋·템플릿이 자동 적용됩니다.
        </p>
        <SampleProjectsGrid onSelect={applySample} />
      </section>
    </div>
  );
}
