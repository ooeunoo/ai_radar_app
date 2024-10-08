/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'supabase.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        permanent: false,
        source: '/',
        destination: '/platforms/ai',
      },
      // Have ai as the default platforms page
      {
        permanent: false,
        source: '/platforms',
        destination: '/platforms/ai',
      },
    ]
  },
}
