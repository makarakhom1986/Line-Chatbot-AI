/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@line/bot-sdk", "@google/genai"],
};

module.exports = nextConfig;
