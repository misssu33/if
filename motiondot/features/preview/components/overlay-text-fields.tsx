'use client';

import type { FocusEvent } from 'react';
import type { TextOverlayLayerId } from '../types/text-overlay-layer';
import {
  overlayTextInputActiveClass,
  overlayTextInputClass,
} from '../constants/overlay-input-classes';
import { trackTextOverlayEdited } from '@/lib/analytics';
import { useOverlayTextForm } from '../hooks/use-overlay-text-form';

function fieldClass(layerId: TextOverlayLayerId, active: TextOverlayLayerId | null) {
  return [overlayTextInputClass, active === layerId ? overlayTextInputActiveClass : '']
    .filter(Boolean)
    .join(' ');
}

function mergeBlurHandler(
  formOnBlur: (e: FocusEvent<HTMLInputElement>) => void,
  onLayerBlur: (e: FocusEvent<HTMLInputElement>) => void,
) {
  return (e: FocusEvent<HTMLInputElement>) => {
    formOnBlur(e);
    onLayerBlur(e);
  };
}

/** 헤드라인·서브·CTA·뱃지 폼 (react-hook-form + Zustand) */
export function OverlayTextFields() {
  const {
    form,
    activeTextLayer,
    setActiveTextLayer,
    setHeadline,
    setSubline,
    setCtaText,
    setBadgeText,
  } = useOverlayTextForm();

  const { register } = form;

  const layerBlur = (e: FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget as HTMLElement | null;
    if (next?.dataset.overlayInput) return;
    setActiveTextLayer(null);
  };

  const headlineField = register('headline', {
    maxLength: { value: 200, message: '200자 이하' },
    onChange: (e) => {
      trackTextOverlayEdited();
      setHeadline(e.target.value);
    },
  });

  const sublineField = register('subline', {
    maxLength: { value: 200, message: '200자 이하' },
    onChange: (e) => {
      trackTextOverlayEdited();
      setSubline(e.target.value);
    },
  });

  const ctaField = register('ctaText', {
    maxLength: { value: 80, message: '80자 이하' },
    onChange: (e) => {
      trackTextOverlayEdited();
      setCtaText(e.target.value);
    },
  });

  const badgeField = register('badgeText', {
    maxLength: { value: 40, message: '40자 이하' },
    onChange: (e) => {
      trackTextOverlayEdited();
      setBadgeText(e.target.value);
    },
  });

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <label className="text-xs">
        <span className="text-zinc-500">헤드라인</span>
        <input
          data-overlay-input="headline"
          className={fieldClass('headline', activeTextLayer)}
          onFocus={() => setActiveTextLayer('headline')}
          onBlur={mergeBlurHandler(headlineField.onBlur, layerBlur)}
          name={headlineField.name}
          ref={headlineField.ref}
          onChange={headlineField.onChange}
        />
      </label>
      <label className="text-xs">
        <span className="text-zinc-500">서브카피</span>
        <input
          data-overlay-input="subline"
          className={fieldClass('subline', activeTextLayer)}
          onFocus={() => setActiveTextLayer('subline')}
          onBlur={mergeBlurHandler(sublineField.onBlur, layerBlur)}
          name={sublineField.name}
          ref={sublineField.ref}
          onChange={sublineField.onChange}
        />
      </label>
      <label className="text-xs sm:col-span-2">
        <span className="text-zinc-500">CTA</span>
        <input
          data-overlay-input="cta"
          className={fieldClass('cta', activeTextLayer)}
          onFocus={() => setActiveTextLayer('cta')}
          onBlur={mergeBlurHandler(ctaField.onBlur, layerBlur)}
          name={ctaField.name}
          ref={ctaField.ref}
          onChange={ctaField.onChange}
        />
      </label>
      <label className="text-xs sm:col-span-2">
        <span className="text-zinc-500">뱃지</span>
        <input
          data-overlay-input="badge"
          className={fieldClass('badge', activeTextLayer)}
          onFocus={() => setActiveTextLayer('badge')}
          onBlur={mergeBlurHandler(badgeField.onBlur, layerBlur)}
          name={badgeField.name}
          ref={badgeField.ref}
          onChange={badgeField.onChange}
        />
      </label>
    </div>
  );
}
