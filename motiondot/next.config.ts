import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "fluent-ffmpeg",
    "ffmpeg-static",
    "bullmq",
    "ioredis",
  ],
};

export default nextConfig;
