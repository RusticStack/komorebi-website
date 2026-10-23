import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Two root layouts (English and Portuguese, each with its own <html lang>) need the global 404 page
    globalNotFound: true,
  },
};

export default withMDX(config);
