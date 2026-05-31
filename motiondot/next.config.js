/** @type {import('next').NextConfig} */
const nextConfig = {
  // fluent-ffmpeg, ffmpeg-static는 Node 런타임 전용
  serverExternalPackages: ['fluent-ffmpeg', 'ffmpeg-static', 'bullmq', 'ioredis'],
};

module.exports = nextConfig;
