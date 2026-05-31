import { Worker } from 'worker_threads';
import path from 'path';
import type { ConvertJobPayload } from '@/types';
import { WORKER_THREAD_COUNT } from '../config';

type PoolTask = {
  payload: ConvertJobPayload;
  resolve: (path: string) => void;
  reject: (err: Error) => void;
};

type WorkerResult =
  | { ok: true; result: string }
  | { ok: false; error: string };

/** FFmpeg 변환용 worker_threads 풀 */
export class ConvertThreadPool {
  private readonly queue: PoolTask[] = [];
  private active = 0;

  constructor(private readonly maxThreads: number) {}

  run(payload: ConvertJobPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ payload, resolve, reject });
      this.drain();
    });
  }

  private drain(): void {
    while (this.active < this.maxThreads && this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) break;
      this.active++;
      void this.runInThread(task).finally(() => {
        this.active--;
        this.drain();
      });
    }
  }

  private runInThread(task: PoolTask): Promise<void> {
    return new Promise((done) => {
      const workerPath = path.join(__dirname, '..', 'threads', 'convert.worker.ts');
      const thread = new Worker(workerPath, {
        workerData: task.payload,
        execArgv: ['--import', 'tsx'],
      });

      thread.on('message', (msg: WorkerResult) => {
        if (msg.ok) task.resolve(msg.result);
        else task.reject(new Error(msg.error));
        done();
      });

      thread.on('error', (err) => {
        task.reject(err);
        done();
      });

      thread.on('exit', (code) => {
        if (code !== 0) {
          task.reject(new Error(`Worker exited with code ${code}`));
          done();
        }
      });
    });
  }
}

let pool: ConvertThreadPool | null = null;

export function getConvertThreadPool(): ConvertThreadPool {
  if (!pool) {
    pool = new ConvertThreadPool(WORKER_THREAD_COUNT);
  }
  return pool;
}
