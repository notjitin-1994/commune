/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  // Ensure Leaflet CSS is properly handled
  transpilePackages: ['leaflet', 'react-leaflet'],
};

module.exports = nextConfig;
