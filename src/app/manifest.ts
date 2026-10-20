import type { MetadataRoute } from "next";
import { siteName } from "@/data/site";

// A static site writes this file once at build time.
export const dynamic = "force-static";

/** Lets a phone add the site to its home screen with the right name, colour and icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName}: dollar, gold and petrol rates in Pakistan`,
    short_name: siteName,
    description: "Today's dollar, gold, petrol and Gulf currency rates in Pakistan from official sources.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#0f2a5f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
