import { create } from 'zustand';
import type { MotionTemplateDefinition } from '@/types/motion-template';
import type {
  OverlayEditorState,
  OverlayLayerId,
  OverlayLayerStyle,
} from '../types/overlay-editor';
import { defaultOverlayFromTemplate } from '../utils/default-overlay-from-template';

interface OverlayEditorStore {
  layers: OverlayEditorState | null;
  templateId: string | null;
  panelOpen: boolean;
  hydrateFromTemplate: (template: MotionTemplateDefinition) => void;
  setLayerText: (layer: OverlayLayerId, text: string) => void;
  setLayerStyle: (
    layer: OverlayLayerId,
    patch: Partial<OverlayLayerStyle>,
  ) => void;
  resetLayerToTemplate: (
    layer: OverlayLayerId,
    template: MotionTemplateDefinition,
  ) => void;
  setPanelOpen: (open: boolean) => void;
}

export const useOverlayEditorStore = create<OverlayEditorStore>((set, get) => ({
  layers: null,
  templateId: null,
  panelOpen: false,

  hydrateFromTemplate: (template) => {
    const id = template.id;
    if (get().templateId === id && get().layers) return;
    set({
      templateId: id,
      layers: defaultOverlayFromTemplate(template),
    });
  },

  setLayerText: (layer, text) =>
    set((s) => {
      if (!s.layers) return s;
      return {
        layers: {
          ...s.layers,
          [layer]: { ...s.layers[layer], text },
        },
      };
    }),

  setLayerStyle: (layer, patch) =>
    set((s) => {
      if (!s.layers) return s;
      return {
        layers: {
          ...s.layers,
          [layer]: {
            ...s.layers[layer],
            style: { ...s.layers[layer].style, ...patch },
          },
        },
      };
    }),

  resetLayerToTemplate: (layer, template) => {
    const defaults = defaultOverlayFromTemplate(template);
    set((s) => {
      if (!s.layers) return s;
      return {
        layers: {
          ...s.layers,
          [layer]: defaults[layer],
        },
      };
    });
  },

  setPanelOpen: (panelOpen) => set({ panelOpen }),
}));
