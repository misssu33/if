export { getFfmpegBinaryPath, createFfmpegCommand } from './binary';
export { convertByFormat, type ConvertOptions, type ConvertQuality } from './convert';
export { encodeGif } from './gif';
export { encodeMp4 } from './mp4';
export { encodeWebp } from './webp';
export { extractFrames } from './extract-frames';
export { runFfmpegCommand, type RunFfmpegOptions } from './run-command';
export { ConversionLogger, readConversionLog } from './conversion-logger';
export { FfmpegConversionError } from './errors';
export {
  createJobTempWorkspace,
  cleanupJobTempWorkspace,
  type JobTempWorkspace,
} from './temp-workspace';
export { runConvertPipeline, type ConvertPipelineInput } from './pipeline';
export type { FfmpegExtractFramesOptions } from './types';
