import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is plain HTML, so the site builds to a folder of static files (`out`)
  // that any static host can serve. Response headers live in public/_headers.
  output: "export",
  // The stylesheet is small, so it goes inside each page instead of a separate request
  // that a slow connection must finish before anything is drawn.
  experimental: { inlineCss: true },
};

export default nextConfig;
