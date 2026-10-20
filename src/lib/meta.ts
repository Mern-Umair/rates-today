import type { Metadata } from "next";
import { siteName } from "@/data/site";

const shareImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${siteName}: dollar, gold and petrol rates in Pakistan`,
};

/**
 * Search and sharing tags for one page. A page that sets its own Open Graph
 * block replaces the site-wide one completely, so the share image and site
 * name are repeated here so they do not disappear from that page.
 */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, title, description, url: path, siteName, locale: "en_PK", images: [shareImage] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
  };
}
