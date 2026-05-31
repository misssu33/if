'use client';

import { useCallback } from 'react';
import { convertVideoToGif } from '../lib/convert-video-to-gif';
import {
  loadVideoElement,
  revokeLoadedVideo,
} from '../lib/load-video-element';
import { validateBrowserVideoFile } from '../lib/validate-browser-video';
import { useVideoGifStore } from '../stores/use-video-gif-store';

/** 비디오 파일 로드 · GIF 변환 */
export function useVideoGifConverter() {
  const store = useVideoGifStore();

  const clearLoaded = useCallback(() => {
    revokeLoadedVideo(useVideoGifStore.getState().loaded);
    useVideoGifStore.getState().setLoaded(null);
  }, []);

  const loadFile = useCallback(
    async (file: File) => {
      const validationError = validateBrowserVideoFile(file);
      if (validationError) {
        store.setError(validationError);
        return;
      }

      clearLoaded();
      store.setFile(file);
      store.setError(null);

      try {
        const loaded = await loadVideoElement(file);
        store.setLoaded(loaded);
      } catch {
        store.setError('비디오를 불러올 수 없습니다. 다른 파일을 시도하세요.');
        store.setPhase('error');
      }
    },
    [clearLoaded, store],
  );

  const convert = useCallback(async () => {
    const state = useVideoGifStore.getState();
    const { loaded, trimStartSec, trimEndSec, fps, outputWidth, fileName } = state;
    if (!loaded) {
      store.setError('먼저 비디오를 선택하세요.');
      return;
    }

    store.setPhase('converting');
    store.setProgress(0, '프레임 추출 중…');
    store.setError(null);
    if (state.resultBlobUrl) {
      URL.revokeObjectURL(state.resultBlobUrl);
    }

    try {
      const result = await convertVideoToGif({
        loaded,
        startSec: trimStartSec,
        endSec: trimEndSec,
        fps,
        outputWidth,
        onProgress: (percent, phase) => {
          useVideoGifStore.getState().setProgress(
            percent,
            phase === 'encode' ? 'GIF 인코딩 중…' : '프레임 추출 중…',
          );
        },
      });

      const blob = new Blob([Uint8Array.from(result.bytes)], { type: 'image/gif' });
      const blobUrl = URL.createObjectURL(blob);
      store.setResult(result.bytes, blobUrl);

      const base = (fileName ?? 'motiondot').replace(/\.[^.]+$/, '');
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = `${base}-clip.gif`;
      anchor.click();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'GIF 변환에 실패했습니다.';
      store.setError(msg);
      store.setPhase('error');
    }
  }, [store]);

  const reset = useCallback(() => {
    const state = useVideoGifStore.getState();
    if (state.resultBlobUrl) URL.revokeObjectURL(state.resultBlobUrl);
    revokeLoadedVideo(state.loaded);
    store.reset();
  }, [store]);

  return { loadFile, convert, reset, clearLoaded };
}
