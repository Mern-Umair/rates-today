import type { CapacitorConfig } from "@capacitor/cli";

// The Android app is the built website (the `out` folder) inside a native shell,
// with the AdMob plugin for ads. `npm run build` first, then `npx cap sync android`.
const config: CapacitorConfig = {
  appId: "pk.ratestoday.app",
  appName: "Rates Today",
  webDir: "out",
  server: {
    // Pages are served from https://localhost inside the app, which keeps cookies,
    // storage and the service worker behaving as on the real site.
    androidScheme: "https",
  },
  android: {
    // Lets the app open the OGRA and SBP source links in the phone's browser.
    allowMixedContent: false,
  },
  plugins: {
    AdMob: {
      // Replace with the real AdMob app ID (ca-app-pub-…~…) in android/app/src/main/AndroidManifest.xml
      // and in src/data/site.ts once the AdMob account exists. Until then the Google test IDs are used.
    },
  },
};

export default config;
