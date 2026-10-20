import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

// A static site writes this file once at build time.
export const dynamic = "force-static";

// Everything is open to every crawler. The AI assistants' crawlers are named as
// well so the intent is explicit: their answers may quote these pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-SearchBot",
          "PerplexityBot",
          "Google-Extended",
          "Bingbot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
