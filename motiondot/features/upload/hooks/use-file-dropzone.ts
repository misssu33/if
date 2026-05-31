'use client';

import { useMediaDropzone } from './use-media-dropzone';

/** @deprecated useMediaDropzone('video') */
export function useFileDropzone() {
  return useMediaDropzone('video');
}
