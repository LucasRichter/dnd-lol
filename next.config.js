/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['ddragon.leagueoflegends.com'],
  },
}

module.exports = nextConfig
