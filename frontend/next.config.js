/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://147.79.83.158:3009/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
