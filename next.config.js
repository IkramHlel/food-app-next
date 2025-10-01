/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'food-app-next.s3.eu-west-3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
// module.exports = nextConfig
