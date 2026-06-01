/** iOS 기기 (iPhone · iPad · iPadOS 데스크톱 UA) */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/** iOS Safari 또는 iOS 내장 WebKit 브라우저 */
export function isIOSSafari(): boolean {
  if (!isIOS()) return false;
  const ua = navigator.userAgent;
  const isOtherIOSBrowser =
    /CriOS|FxiOS|EdgiOS|OPiOS|mercury/i.test(ua);
  if (isOtherIOSBrowser) return false;
  return /Safari/i.test(ua) || /AppleWebKit/i.test(ua);
}

/** iOS 계열 브라우저 전반 (Safari · Chrome iOS · in-app WebView 등) */
export function isIOSBrowser(): boolean {
  return isIOS();
}

export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export function canShareFiles(): boolean {
  if (!canUseWebShare() || typeof navigator.canShare !== 'function') {
    return false;
  }
  try {
    const probe = new File([''], 'motiondot-probe.gif', { type: 'image/gif' });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}
