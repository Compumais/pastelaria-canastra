import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  distDir: "out",
  output: "export",
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: [
        path.resolve(__dirname, 'src-tauri')
      ],
    });

    return config;
  }
};

export default nextConfig;
