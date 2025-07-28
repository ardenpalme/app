import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        canvas: 'commonjs canvas', // Prevent Webpack from bundling `canvas`
      });
      config.resolve.alias['canvas'] = false; // Fallback: treat canvas as false
    }
    return config;
  },
};

export default nextConfig;
