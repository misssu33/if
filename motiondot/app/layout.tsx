import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Motiondot',
  description: 'SNS 영상 변환 및 export',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
