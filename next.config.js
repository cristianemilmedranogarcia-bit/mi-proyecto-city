/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    '/**': ['./prisma/dev.db'],
  },
};

module.exports = nextConfig;
