import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',

  trailingSlash: true,

  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'bufferutil': 'commonjs bufferutil',
        'utf-8-validate': 'commonjs utf-8-validate',
      });
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      'fs': false,
      'net': false,
      'tls': false,
      'utf-8-validate': false,
      'bufferutil': false,
    };

    return config;
  },
};

export default nextConfig;
