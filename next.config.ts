/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other config...
  pageExtensions: ['ts', 'tsx', 'mdx'], // Add 'mdx'
};

const withMDX = require('@next/mdx')();
module.exports = withMDX(nextConfig);
