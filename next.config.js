// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // suas configurações aqui
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

module.exports = nextConfig;
