/** 비율 유지 스케일 + 패딩 */
export function buildScalePadFilter(width: number, height: number): string {
  return [
    `scale=${width}:${height}:force_original_aspect_ratio=decrease`,
    `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black`,
  ].join(',');
}

/** FPS 필터 */
export function buildFpsFilter(fps: number): string {
  return `fps=${fps}`;
}

/** GIF/WebP/MP4 공통 비디오 필터 체인 */
export function buildVideoFilterChain(
  width: number,
  height: number,
  fps: number,
  watermarkText?: string,
): string {
  const base = `${buildScalePadFilter(width, height)},${buildFpsFilter(fps)}`;
  if (!watermarkText) return base;

  const escaped = watermarkText
    .replaceAll('\\', '\\\\')
    .replaceAll(':', '\\:')
    .replaceAll("'", "\\'");

  const watermark = [
    `drawtext=text='${escaped}'`,
    'fontcolor=white@0.8',
    'fontsize=h*0.04',
    'x=w-tw-24',
    'y=h-th-24',
    "box=1:boxcolor=black@0.35:boxborderw=10",
  ].join(':');

  return `${base},${watermark}`;
}
