'use client';

import type { MotionTemplateDefinition } from '@/types/motion-template';
import type { MotionAdTemplateId } from '@/features/preview/stores/use-preview-store';
import { groupTemplatesForSelect } from '@/features/templates/utils/sort-templates-for-display';
import { formatTemplateOptionLabel } from '@/features/preview/utils/format-template-option-label';
import { overlaySelectClass } from '@/features/preview/constants/overlay-input-classes';

type TemplateSelectFieldProps = {
  templates: MotionTemplateDefinition[];
  templateId: MotionAdTemplateId;
  loading?: boolean;
  disabled?: boolean;
  onChange: (id: MotionAdTemplateId) => void;
};

/** TikTok 제휴 9:16 우선 템플릿 셀렉트 */
export function TemplateSelectField({
  templates,
  templateId,
  loading,
  disabled,
  onChange,
}: TemplateSelectFieldProps) {
  const { primary916, secondary916, other } = groupTemplatesForSelect(templates);

  return (
    <select
      className={overlaySelectClass}
      value={templateId}
      disabled={disabled ?? loading}
      onChange={(e) => onChange(e.target.value as MotionAdTemplateId)}
    >
      <optgroup label="TikTok 제휴 · 9:16">
        {primary916.map((t) => (
          <option key={t.id} value={t.id}>
            {formatTemplateOptionLabel(t)}
          </option>
        ))}
      </optgroup>
      {secondary916.length > 0 && (
        <optgroup label="쿠팡 · 보조 (9:16)">
          {secondary916.map((t) => (
            <option key={t.id} value={t.id}>
              {formatTemplateOptionLabel(t)}
            </option>
          ))}
        </optgroup>
      )}
      {other.length > 0 && (
        <optgroup label="기타 비율">
          {other.map((t) => (
            <option key={t.id} value={t.id}>
              {formatTemplateOptionLabel(t)}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}
