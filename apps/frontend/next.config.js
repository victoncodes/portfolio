/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/offline.html',
  },
});

module.exports = withPWA({
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
});
