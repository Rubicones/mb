import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mb-portfolio.fly.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mb-portfolio.fly.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
