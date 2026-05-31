import { appendFile, mkdir } from 'fs/promises';
import path from 'path';
import { getTempLogsDir } from '@/lib/storage/paths';

/** 작업별 변환 로그 (temp/logs/) */
export class ConversionLogger {
  private readonly logPath: string;
  private writeChain: Promise<void> = Promise.resolve();

  constructor(private readonly jobId: string) {
    this.logPath = path.join(getTempLogsDir(), `${jobId}.log`);
  }

  private enqueue(line: string): void {
    const stamp = new Date().toISOString();
    const row = `[${stamp}] ${line}\n`;
    this.writeChain = this.writeChain.then(async () => {
      await mkdir(getTempLogsDir(), { recursive: true });
      await appendFile(this.logPath, row, 'utf-8');
    });
  }

  info(message: string): void {
    this.enqueue(`INFO  ${message}`);
    console.log(`[convert:${this.jobId}] ${message}`);
  }

  error(message: string): void {
    this.enqueue(`ERROR ${message}`);
    console.error(`[convert:${this.jobId}] ${message}`);
  }

  async flush(): Promise<void> {
    await this.writeChain;
  }

  getLogPath(): string {
    return this.logPath;
  }
}

export async function readConversionLog(
  jobId: string,
  tailLines = 100,
): Promise<string> {
  const logPath = path.join(getTempLogsDir(), `${jobId}.log`);
  try {
    const { readFile } = await import('fs/promises');
    const raw = await readFile(logPath, 'utf-8');
    const lines = raw.trim().split('\n');
    return lines.slice(-tailLines).join('\n');
  } catch {
    return '';
  }
}
