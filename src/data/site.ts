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
 * Where the Android app fetches today's rates from. The website reads its own
 * /data/rates.json; the app has no server of its own, so it reads the same file
 * from wherever it is published: the live site, or the GitHub repository's raw
 * file before the site is live. Set NEXT_PUBLIC_RATES_URL at build time.
 */
export const liveDataUrl: string = process.env.NEXT_PUBLIC_RATES_URL ?? `${siteUrl}/data/rates.json`;

/**
 * AdMob IDs for the Android app. These are Google's public test IDs, which show
 * test ads and never earn. Replace them with the real ones from the AdMob
 * account (app ID also goes in android/app/src/main/AndroidManifest.xml).
 */
export const admob = {
  appId: "ca-app-pub-3940256099942544~3347511713",
  banner: "ca-app-pub-3940256099942544/6300978111",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  testing: true,
};

/**
 * Google AdSense publisher ID. The site lives on a subdomain of formkb.com, so the
 * FormKB AdSense approval covers it; the same ID goes here.
 */
export const adsenseClient: string = "ca-pub-8876309021692504";
