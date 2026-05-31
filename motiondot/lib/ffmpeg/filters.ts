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
): string {
  return `${buildScalePadFilter(width, height)},${buildFpsFilter(fps)}`;
}
