import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.0.9'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.safarion.co.kr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hwl-safarion-bucket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hwl-safarion-dev-bucket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
