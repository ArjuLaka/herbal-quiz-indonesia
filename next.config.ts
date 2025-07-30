/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

const withMDX = require('@next/mdx')();
module.exports = withMDX(nextConfig);
