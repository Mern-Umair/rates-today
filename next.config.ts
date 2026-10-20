import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is plain HTML, so the site builds to a folder of static files (`out`)
  // that any static host can serve. Response headers live in public/_headers.
  output: "export",
  // Every page is written as a folder with an index.html (about/index.html), which is
  // what the Android shell expects when it serves the site from inside the app.
  trailingSlash: true,
  // The stylesheet is small, so it goes inside each page instead of a separate request
  // that a slow connection must finish before anything is drawn.
  experimental: { inlineCss: true },
};

export default nextConfig;
