import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cptxhlvicfnbcxmpjasw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/_/backend/api/:path*',
      },
    ];
  },
};

export default nextConfig;
