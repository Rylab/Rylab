/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS ? process.env.ALLOWED_DEV_ORIGINS.split(',') : [],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
