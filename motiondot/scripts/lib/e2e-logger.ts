/** E2E 스크립트용 구조화 로그 */
export type E2eLogLevel = 'info' | 'warn' | 'error' | 'step' | 'progress';

function stamp(): string {
  return new Date().toISOString();
}

export function e2eLog(
  level: E2eLogLevel,
  message: string,
  detail?: Record<string, unknown>,
): void {
  const prefix =
    level === 'step'
      ? '▶'
      : level === 'progress'
        ? '…'
        : level === 'warn'
          ? '⚠'
          : level === 'error'
            ? '✗'
            : '•';
  const line = `[e2e ${stamp()}] ${prefix} ${message}`;
  if (detail && Object.keys(detail).length > 0) {
    const sink = level === 'error' ? console.error : console.log;
    sink(line, detail);
  } else if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}

export function e2eStep(title: string): void {
  e2eLog('step', title);
}

export function e2eFail(message: string, err?: unknown): never {
  if (err instanceof Error) {
    e2eLog('error', message, { error: err.message, stack: err.stack });
  } else if (err !== undefined) {
    e2eLog('error', message, { detail: typeof err === 'object' ? err : String(err) });
  } else {
    e2eLog('error', message);
  }
  process.exit(1);
}
