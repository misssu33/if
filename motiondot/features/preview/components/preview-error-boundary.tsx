'use client';

import type { ReactNode } from 'react';
import { Component } from 'react';
import { Button } from '@/components/ui';

type Props = {
  children: ReactNode;
  onReset?: () => void;
};

type State = {
  hasError: boolean;
};

/** Remotion 미리보기 크래시 시 전체 페이지 대신 폴백 */
export class PreviewErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('[preview]', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50/80 p-4 text-center dark:border-red-900 dark:bg-red-950/30"
          role="alert"
        >
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            미리보기를 불러올 수 없습니다
          </p>
          <p className="text-xs text-red-700/90 dark:text-red-300/90">
            미디어 형식이 맞지 않거나 데이터가 없을 수 있습니다. 프리셋·템플릿을
            바꾸거나 이미지를 다시 업로드해 보세요.
          </p>
          {this.props.onReset && (
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onReset?.();
              }}
            >
              다시 시도
            </Button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
