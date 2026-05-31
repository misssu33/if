'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui';
import {
  BROWSER_VIDEO_ACCEPT,
  BROWSER_VIDEO_MAX_BYTES,
} from '../constants';
import { useVideoGifConverter } from '../hooks/use-video-gif-converter';
import { useVideoGifStore } from '../stores/use-video-gif-store';
import { VideoGifControls } from './video-gif-controls';
import { VideoGifPreview } from './video-gif-preview';
import { VideoGifProgress } from './video-gif-progress';

function formatRejection(code: string, name: string): string {
  if (code === 'file-too-large') return `${name}: 용량 초과 (브라우저 변환 한도)`;
  if (code === 'file-invalid-type') return `${name}: MP4·WebM·MOV만 지원`;
  return `${name}: 업로드할 수 없습니다`;
}

/**
 * 브라우저 내 비디오→GIF (서버 큐·Redis·Worker 미사용)
 * 기존 이미지·배치 비디오 파이프라인과 분리
 */
export function VideoGifPanel() {
  const fileName = useVideoGifStore((s) => s.fileName);
  const phase = useVideoGifStore((s) => s.phase);
  const resultBlobUrl = useVideoGifStore((s) => s.resultBlobUrl);
  const error = useVideoGifStore((s) => s.error);

  const { loadFile, convert, reset } = useVideoGifConverter();

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (file) void loadFile(file);
    },
    [loadFile],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDropRejected: (rejections) => {
      const msg = rejections[0];
      const code = msg?.errors[0]?.code ?? 'unknown';
      useVideoGifStore.getState().setError(formatRejection(code, msg.file.name));
      useVideoGifStore.getState().setPhase('error');
    },
    accept: BROWSER_VIDEO_ACCEPT,
    multiple: false,
    maxSize: BROWSER_VIDEO_MAX_BYTES,
    disabled: phase === 'converting' || phase === 'loading',
  });

  const isBusy = phase === 'converting' || phase === 'loading';
  const borderClass = isDragReject
    ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
    : isDragActive
      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
      : 'border-zinc-300 dark:border-zinc-700';

  return (
    <section
      className="flex min-w-0 flex-col gap-4 rounded-xl border border-violet-200 bg-violet-50/40 p-4 dark:border-violet-900 dark:bg-violet-950/20 sm:p-5"
      aria-labelledby="video-gif-heading"
    >
      <div>
        <h2
          id="video-gif-heading"
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        >
          브라우저에서 바로 GIF 만들기
        </h2>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          짧은 MP4·WebM·MOV를 서버 없이 GIF로 변환합니다. SNS 배치 변환(아래)과
          별도로 동작합니다.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-5 text-center transition-colors ${borderClass} ${
          isBusy ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        <input {...getInputProps()} aria-label="브라우저 GIF용 비디오 선택" />
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {isDragActive ? '여기에 놓기' : '비디오 드래그 또는 클릭'}
        </p>
        <p className="mt-1 text-xs text-zinc-500">MP4 · WebM · MOV · 최대 80MB</p>
        {fileName && (
          <p className="mt-2 truncate text-xs text-violet-700 dark:text-violet-300">
            {fileName}
          </p>
        )}
      </div>

      {error && phase !== 'converting' && (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <VideoGifPreview />
      <VideoGifControls />
      <VideoGifProgress />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={phase !== 'ready' && phase !== 'done'}
          onClick={() => void convert()}
        >
          {phase === 'converting' ? '변환 중…' : 'GIF 생성 · 다운로드'}
        </Button>
        {resultBlobUrl && (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              const a = document.createElement('a');
              a.href = resultBlobUrl;
              a.download = `${(fileName ?? 'clip').replace(/\.[^.]+$/, '')}.gif`;
              a.click();
            }}
          >
            GIF 다시 받기
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          disabled={isBusy}
          onClick={reset}
        >
          초기화
        </Button>
      </div>
    </section>
  );
}
