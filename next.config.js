/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // The old pages now live under /app.
  async redirects() {
    return [
      { source: '/hotels', destination: '/app/portfolio', permanent: false },
      { source: '/hotels/:id', destination: '/app/portfolio', permanent: false },
      { source: '/inspections', destination: '/app', permanent: false },
      { source: '/inspections/:path*', destination: '/app', permanent: false },
      { source: '/reports', destination: '/app/reports', permanent: false },
      { source: '/settings', destination: '/app', permanent: false },
    ]
  },
}

module.exports = nextConfig
