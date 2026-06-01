'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { OverlaySpacing } from './overlay-spacing';
import { getOverlaySpacing } from './overlay-spacing';

const OverlayStackContext = createContext<OverlaySpacing | null>(null);

export function OverlayStackProvider({
  aspectRatio,
  width,
  height,
  children,
}: {
  aspectRatio: string;
  width: number;
  height: number;
  children: ReactNode;
}) {
  const spacing = getOverlaySpacing(aspectRatio, width, height);
  return (
    <OverlayStackContext.Provider value={spacing}>
      {children}
    </OverlayStackContext.Provider>
  );
}

export function useOverlaySpacing(): OverlaySpacing {
  const ctx = useContext(OverlayStackContext);
  if (!ctx) {
    return getOverlaySpacing('9:16', 1080, 1920);
  }
  return ctx;
}
