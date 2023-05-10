/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  transpilePackages: ['antd'],
};

module.exports = nextConfig;
