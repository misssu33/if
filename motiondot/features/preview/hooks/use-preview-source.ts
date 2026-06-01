'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBatchStore } from '@/stores';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import { useOverlayEditor } from '@/features/editor/hooks/use-overlay-editor';
import { useTemplateCatalog } from '@/features/templates/hooks/use-template-catalog';
import { resolveTemplateId } from '@/features/templates/utils/legacy-template-map';
import { buildPreviewProps } from '../engine/build-preview-props';
import { usePreviewStore } from '../stores/use-preview-store';
import { isValidCompositionProps } from '../utils/validate-composition-props';

/** 업로드 + 템플릿 JSON + 오버레이 편집기 → Remotion props */
export function usePreviewSource() {
  const files = useBatchStore((s) => s.files);
  const resolved = useExportSettingsStore((s) => s.resolved);
  const { templates, loading: templatesLoading, getById } = useTemplateCatalog();

  const selectedFileId = usePreviewStore((s) => s.selectedFileId);
  const previewFormat = usePreviewStore((s) => s.previewFormat);
  const templateId = usePreviewStore((s) => s.templateId);
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
    () =>
      resolveTemplateId(templateId, templates) ??
      getById('tiktok-product-hook'),
    [templateId, templates, getById],
  );

  const { previewText, overlayStyles } = useOverlayEditor(template);

  const format = resolved?.outputFormat ?? previewFormat;

  const rawInputProps = useMemo(() => {
    if (!template) return null;
    return buildPreviewProps({
      template,
      file,
      format,
      mediaSrc,
      durationSec,
      headline: previewText.headline,
      subline: previewText.subline,
      ctaText: previewText.ctaText,
      badgeText: previewText.badgeText,
      overlayStyles,
    });
  }, [
    template,
    file,
    format,
    mediaSrc,
    durationSec,
    previewText.headline,
    previewText.subline,
    previewText.ctaText,
    previewText.badgeText,
    overlayStyles,
  ]);

  const inputProps = isValidCompositionProps(rawInputProps)
    ? rawInputProps
    : null;

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
