/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  serverExternalPackages: ["ffmpeg-static", "playwright", "openai"],
};

export default nextConfig;
