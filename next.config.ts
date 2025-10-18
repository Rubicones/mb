import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'authentic-splendor-f67c9d75a4.strapiapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'authentic-splendor-f67c9d75a4.media.strapiapp.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
