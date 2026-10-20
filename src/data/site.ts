export const siteName = "Rates Today";

// The address used in canonical links, the sitemap and share images.
// Set NEXT_PUBLIC_SITE_URL on the host only if the site moves to another domain.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rates.formkb.com").replace(/\/$/, "");

export const owner = {
  name: "Umair Tahir",
  city: "Lahore, Pakistan",
  email: "umairii2207@gmail.com",
};

export const tagline = "Dollar, gold, petrol and Gulf currency rates in Pakistan, updated every day from official sources.";

/**
 * Google AdSense publisher ID. The site lives on a subdomain of formkb.com, so the
 * FormKB AdSense approval covers it; the same ID goes here.
 */
export const adsenseClient: string = "ca-pub-8876309021692504";
