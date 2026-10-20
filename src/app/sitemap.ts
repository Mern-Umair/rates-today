import type { MetadataRoute } from "next";
import { currencyPages, ratePages } from "@/data/pages";
import { siteUrl } from "@/data/site";
import { rates } from "@/lib/rates";

// A static site writes this file once at build time.
export const dynamic = "force-static";

// Rate pages change with every data update; the policy pages rarely.
const updated = new Date(rates.updated);

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "yearly", lastModified: Date) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    entry("", 1, "daily", updated),
    ...ratePages.map((page) => entry(page.href, 0.9, "daily", updated)),
    ...currencyPages.map((page) => entry(`/${page.slug}`, 0.8, "daily", updated)),
    ...["/about", "/contact", "/privacy", "/terms"].map((path) => entry(path, 0.3, "yearly", new Date("2026-10-20"))),
  ];
}
