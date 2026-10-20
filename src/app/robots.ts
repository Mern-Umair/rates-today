import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

// A static site writes this file once at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
