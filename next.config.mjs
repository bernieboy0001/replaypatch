/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  serverExternalPackages: ["ffmpeg-static", "playwright", "openai"],
  outputFileTracingIncludes: {
    "/api/analyze": [
      "./node_modules/ffmpeg-static/ffmpeg",
      "./sample-app/**/*",
    ],
  },
};

export default nextConfig;
