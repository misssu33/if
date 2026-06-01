'use client';

import { useEffect, useState } from 'react';
import { isIOSBrowser } from '@/lib/utils/device';

/** 클라이언트 전용 iOS 감지 (SSR hydration 불일치 방지) */
export function useIsIOS(): boolean {
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setIos(isIOSBrowser());
  }, []);

  return ios;
}
