'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBatchStore } from '@/stores';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import { useTemplateCatalog } from '@/features/templates/hooks/use-template-catalog';
import { resolveTemplateId } from '@/features/templates/utils/legacy-template-map';
import { buildPreviewProps } from '../engine/build-preview-props';
import { usePreviewStore } from '../stores/use-preview-store';
import { isValidCompositionProps } from '../utils/validate-composition-props';

/** 업로드 + 템플릿 JSON → Remotion props (프리셋 없어도 템플릿만으로 미리보기) */
export function usePreviewSource() {
  const files = useBatchStore((s) => s.files);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const { templates, loading: templatesLoading, getById } = useTemplateCatalog();

  const selectedFileId = usePreviewStore((s) => s.selectedFileId);
  const previewFormat = usePreviewStore((s) => s.previewFormat);
  const templateId = usePreviewStore((s) => s.templateId);
  const headline = usePreviewStore((s) => s.headline);
  const subline = usePreviewStore((s) => s.subline);
  const ctaText = usePreviewStore((s) => s.ctaText);
  const badgeText = usePreviewStore((s) => s.badgeText);
  const durationSec = usePreviewStore((s) => s.durationSec);
  const loopPlayback = usePreviewStore((s) => s.loopPlayback);

  const file = useMemo(() => {
    const id = selectedFileId ?? files[0]?.id;
    return files.find((f) => f.id === id);
  }, [files, selectedFileId]);

  const [mediaSrc, setMediaSrc] = useState<string | undefined>();

  useEffect(() => {
    if (!file) {
      setMediaSrc(undefined);
      return;
    }
    setMediaSrc(
      `/api/preview/media?path=${encodeURIComponent(file.tempPath)}`,
    );
  }, [file?.id, file?.tempPath]);

  const template = useMemo(
    () => resolveTemplateId(templateId, templates) ?? getById('tiktok-product-hook'),
    [templateId, templates, getById],
  );

  const format = resolved?.outputFormat ?? previewFormat;

  const rawInputProps = useMemo(() => {
    if (!template) return null;
    return buildPreviewProps({
      template,
      file,
      format,
      mediaSrc,
      durationSec,
      headline,
      subline,
      ctaText,
      badgeText,
    });
  }, [
    template,
    file,
    format,
    mediaSrc,
    durationSec,
    headline,
    subline,
    ctaText,
    badgeText,
  ]);

  const inputProps = isValidCompositionProps(rawInputProps) ? rawInputProps : null;

  return {
    files,
    file,
    inputProps,
    loopPlayback,
    previewFormat: format,
    templates,
    templatesLoading,
    template,
    hasPreset: !!resolved,
  };
}
