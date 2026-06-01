'use client';

import { useEffect, useRef } from 'react';
import type { MotionTemplateDefinition } from '@/types/motion-template';
import { trackTemplateViewed } from '@/lib/analytics';

type TemplateViewedTrackerProps = {
  template: MotionTemplateDefinition | undefined;
};

/** 미리보기에 템플릿이 표시될 때 template_viewed 1회 */
export function TemplateViewedTracker({ template }: TemplateViewedTrackerProps) {
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    if (!template || lastId.current === template.id) return;
    lastId.current = template.id;
    trackTemplateViewed(template);
  }, [template]);

  return null;
}
