const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site is just a blank page, when I enable this
  // experimental: {
  //   instrumentationHook: true,
  // },
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'wishonia-blob.public.blob.vercel-storage.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'pcpfoetqkuq7jmso.public.blob.vercel-storage.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.openai.com',
        port: '',
      },
    ]
  },
  output: 'standalone',
  // Add rewrite rules for the ionic app and its assets
  async rewrites() {
    return [
      {
        source: '/ionic',
        destination: '/ionic/index.html',
      },
      {
        source: '/ionic/:path*',
        destination: '/ionic/:path*',
      },
      // Handle root-level asset requests when in ionic context
      {
        source: '/js/:file*',
        destination: '/ionic/js/:file*',
      },
      {
        source: '/css/:file*',
        destination: '/ionic/css/:file*',
      },
      {
        source: '/fonts/:file*',
        destination: '/ionic/fonts/:file*',
      },
      {
        source: '/lib/:file*',
        destination: '/ionic/lib/:file*',
      },
      {
        source: '/data/:file*',
        destination: '/ionic/data/:file*',
      },
      {
        source: '/templates/:file*',
        destination: '/ionic/templates/:file*',
      },
      {
        source: '/highcharts/:file*',
        destination: '/ionic/highcharts/:file*',
      }
    ]
  },
}

module.exports = withBundleAnalyzer(nextConfig)
