const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

/** 클라이언트 이미지 검증 */
export function validateImageFile(file: File): string | null {
  if (IMAGE_TYPES.has(file.type)) return null;
  const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return null;
  return '지원하지 않는 이미지 형식입니다';
}
