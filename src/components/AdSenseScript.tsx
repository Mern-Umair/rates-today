"use client";

// Loads the AdSense script on the website only. The same pages run inside the
// Android app, where AdSense is not allowed (the app uses AdMob instead), so the
// script is added after the page loads and skipped when the app shell is present.
import { useEffect } from "react";
import { adsenseClient } from "@/data/site";

export function AdSenseScript() {
  useEffect(() => {
    if (!adsenseClient) return;
    const capacitor = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
    if (capacitor?.isNativePlatform?.()) return;
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;
    document.head.appendChild(script);
  }, []);
  return null;
}
