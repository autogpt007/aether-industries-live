
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/aether-industries.firebasestorage.app/o/**', // Corrected bucket name
      }
    ],
  },
  allowedDevOrigins: [ // Moved to top-level and ensured clean syntax
    'https://3000-firebase-studio-1749726577656.cluster-f4iwdviaqvc2ct6pgytzw4xqy4.cloudworkstations.dev',
    'https://9000-firebase-studio-1749726577656.cluster-f4iwdviaqvc2ct6pgytzw4xqy4.cloudworkstations.dev',
    // add more allowed dev origins here if needed
  ],
  // If you have other experimental features, they would go into an experimental object here.
  // For example:
  // experimental: {
  //   // someOtherFeature: true,
  // },
};

export default nextConfig;
