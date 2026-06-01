import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MotionDot',
    short_name: 'MotionDot',
    description: 'SNS용 GIF/MP4/WebP 배치 변환 웹 앱',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#111827',
    icons: [
      {
        src: '/app-icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
