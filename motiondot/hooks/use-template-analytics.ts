'use client';

import { useEffect, useRef } from 'react';
import { useOnboardingStore } from '@/features/onboarding/stores/use-onboarding-store';
import { usePreviewStore } from '@/features/preview/stores/use-preview-store';
import { useTemplateCatalog } from '@/features/templates/hooks/use-template-catalog';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  hadExportThisSession,
  markTemplateSelected,
  noteCtaChange,
  setActiveTemplateMeta,
  startTemplateEditSession,
  wasTemplateSelectedThisSession,
} from '@/lib/analytics/session';
import { setLastTemplateUsed } from '@/lib/analytics/storage';

/** 템플릿 선택·조회·이탈·CTA 편집 추적 */
export function useTemplateAnalytics() {
  const analytics = useAnalytics();
  const templateId = usePreviewStore((s) => s.templateId);
  const ctaText = usePreviewStore((s) => s.ctaText);
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const { getById } = useTemplateCatalog();
  const prevStepRef = useRef(currentStep);
  const prevTemplateRef = useRef(templateId);

  useEffect(() => {
    if (currentStep !== 2 && currentStep !== 3) return;
    const template = getById(templateId);
    analytics.templateViewed({
      template_id: templateId,
      template_name: template?.name,
    });
  }, [currentStep, templateId, getById, analytics]);

  useEffect(() => {
    const template = getById(templateId);
    const name = template?.name;

    if (prevTemplateRef.current !== templateId) {
      analytics.templateViewed({ template_id: templateId, template_name: name });
      analytics.templateSelected({ template_id: templateId, template_name: name });
      markTemplateSelected();
      setLastTemplateUsed(templateId);
            setActiveTemplateMeta(templateId, name);
      startTemplateEditSession('지금 구매');
      prevTemplateRef.current = templateId;
    }
  }, [templateId, getById, analytics]);

  useEffect(() => {
    noteCtaChange(ctaText);
  }, [ctaText]);

  useEffect(() => {
    const prev = prevStepRef.current;
    if (
      prev === 3 &&
      currentStep < 3 &&
      wasTemplateSelectedThisSession() &&
      !hadExportThisSession()
    ) {
      const template = getById(templateId);
      analytics.templateAbandoned({
        template_id: templateId,
        template_name: template?.name,
        step: prev,
      });
    }
    prevStepRef.current = currentStep;
  }, [currentStep, templateId, getById, analytics]);
}
