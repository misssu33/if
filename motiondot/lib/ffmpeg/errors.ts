/** FFmpeg 변환 실패 (상위에서 catch) */
export class FfmpegConversionError extends Error {
  readonly jobId?: string;
  readonly format?: string;
  readonly cause?: Error;

  constructor(
    message: string,
    options?: { jobId?: string; format?: string; cause?: Error },
  ) {
    super(message);
    this.name = 'FfmpegConversionError';
    this.jobId = options?.jobId;
    this.format = options?.format;
    this.cause = options?.cause;
  }
}
