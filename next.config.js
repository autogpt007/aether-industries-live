const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: { appDir: true },
  distDir: ".next",
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
  env: {
    // Only for client-side safe vars
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
};