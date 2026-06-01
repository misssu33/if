import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { PostHogProvider } from '@/components/analytics/posthog-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-hidden antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
