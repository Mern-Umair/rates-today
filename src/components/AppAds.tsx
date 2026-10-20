"use client";

// Ads inside the Android app only. On the website this component does nothing;
// the website uses AdSense through the script tag in the layout.
//
// A banner sits at the bottom of the screen, and an interstitial (full-screen,
// closable) is shown at most once every few page views, never on the first one,
// so that someone checking one rate is not interrupted.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { admob } from "@/data/site";

const INTERSTITIAL_EVERY = 4;
const INTERSTITIAL_GAP_MS = 3 * 60 * 1000;

let views = 0;
let lastInterstitial = 0;
let ready: Promise<typeof import("@capacitor-community/admob") | null> | null = null;

function isNativeApp() {
  const capacitor = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(capacitor?.isNativePlatform?.());
}

/** Loads and initialises the plugin once; resolves to null on the website. */
function plugin() {
  if (!ready) {
    ready = (async () => {
      if (!isNativeApp()) return null;
      const mod = await import("@capacitor-community/admob");
      await mod.AdMob.initialize({ initializeForTesting: admob.testing });
      return mod;
    })().catch(() => null);
  }
  return ready;
}

async function showBanner() {
  const mod = await plugin();
  if (!mod) return;
  // The banner sits over the bottom of the page, so pad the page by its height
  // or the footer's last lines would be hidden behind it.
  await mod.AdMob.addListener(mod.BannerAdPluginEvents.SizeChanged, (size) => {
    document.body.style.paddingBottom = `${Math.max(0, size.height)}px`;
  });
  await mod.AdMob.showBanner({
    adId: admob.banner,
    adSize: mod.BannerAdSize.ADAPTIVE_BANNER,
    position: mod.BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: admob.testing,
  });
}

async function maybeInterstitial() {
  views += 1;
  if (views < 2 || views % INTERSTITIAL_EVERY !== 0) return;
  if (Date.now() - lastInterstitial < INTERSTITIAL_GAP_MS) return;
  const mod = await plugin();
  if (!mod) return;
  try {
    await mod.AdMob.prepareInterstitial({ adId: admob.interstitial, isTesting: admob.testing });
    await mod.AdMob.showInterstitial();
    lastInterstitial = Date.now();
  } catch {
    // No fill or no network: skip quietly.
  }
}

export function AppAds() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isNativeApp()) return;
    void showBanner();
  }, []);

  useEffect(() => {
    if (!isNativeApp()) return;
    void maybeInterstitial();
  }, [pathname]);

  return null;
}
