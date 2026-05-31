'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MotionTemplateDefinition } from '@/types/motion-template';

/** 클라이언트 템플릿 카탈로그 */
export function useTemplateCatalog() {
  const [templates, setTemplates] = useState<MotionTemplateDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/templates');
      if (!res.ok) throw new Error('Failed to load templates');
      setTemplates((await res.json()) as MotionTemplateDefinition[]);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getById = useCallback(
    (id: string) => templates.find((t) => t.id === id),
    [templates],
  );

  return { templates, loading, error, refresh, getById };
}
