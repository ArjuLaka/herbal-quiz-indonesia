/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

const withMDX = require('@next/mdx')();
module.exports = withMDX(nextConfig);
