// Draws the Android launcher icons and splash screens into android/app/src/main/res.
// Run `node scripts/make-android-icons.mjs` after changing the logo; then `npx cap sync android`.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const res = join(root, "android", "app", "src", "main", "res");
const navy = "#0f2a5f";
const blue = "#1d4ed8";

const lines = (size) =>
  h(
    "svg",
    { width: size, height: size, viewBox: "0 0 36 36" },
    h("path", {
      d: "M8 26l7-7 5 4 8-9",
      fill: "none",
      stroke: "#86efac",
      strokeWidth: 2.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
    h("path", {
      d: "M23 14h5v5",
      fill: "none",
      stroke: "#86efac",
      strokeWidth: 2.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  );

/** The mark on a background that fills the whole image. */
const tile = (size, background, markScale = 0.86) =>
  h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
      },
    },
    h(
      "div",
      { style: { position: "relative", width: size * markScale, height: size * markScale, display: "flex" } },
      lines(size * markScale),
      h(
        "div",
        {
          style: {
            position: "absolute",
            left: size * markScale * 0.2,
            top: size * markScale * 0.13,
            fontSize: size * markScale * 0.3,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1,
          },
        },
        "Rs",
      ),
    ),
  );

const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

async function png(element, width, height) {
  return Buffer.from(await new ImageResponse(element, { width, height }).arrayBuffer());
}

for (const [density, scale] of Object.entries(densities)) {
  const dir = join(res, `mipmap-${density}`);
  mkdirSync(dir, { recursive: true });
  const legacy = Math.round(48 * scale);
  writeFileSync(join(dir, "ic_launcher.png"), await png(tile(legacy, blue), legacy, legacy));
  writeFileSync(join(dir, "ic_launcher_round.png"), await png(tile(legacy, blue), legacy, legacy));
  // Adaptive icon foreground: 108 dp with the mark inside the 66 dp safe zone.
  const adaptive = Math.round(108 * scale);
  writeFileSync(join(dir, "ic_launcher_foreground.png"), await png(tile(adaptive, blue, 0.5), adaptive, adaptive));
  console.log(`mipmap-${density}: ${legacy}px icons, ${adaptive}px foreground`);
}

// Splash screens: the mark centred on navy, portrait and landscape.
const splash = {
  "port-mdpi": [320, 480],
  "port-hdpi": [480, 800],
  "port-xhdpi": [720, 1280],
  "port-xxhdpi": [960, 1600],
  "port-xxxhdpi": [1280, 1920],
  "land-mdpi": [480, 320],
  "land-hdpi": [800, 480],
  "land-xhdpi": [1280, 720],
  "land-xxhdpi": [1600, 960],
  "land-xxxhdpi": [1920, 1280],
};
for (const [name, [width, height]] of Object.entries(splash)) {
  const dir = join(res, `drawable-${name}`);
  mkdirSync(dir, { recursive: true });
  const mark = Math.round(Math.min(width, height) * 0.28);
  const element = h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: navy,
      },
    },
    h(
      "div",
      { style: { width: mark, height: mark, display: "flex", borderRadius: mark * 0.25, overflow: "hidden" } },
      tile(mark, blue),
    ),
  );
  writeFileSync(join(dir, "splash.png"), await png(element, width, height));
}
writeFileSync(
  join(res, "drawable", "splash.png"),
  await png(
    h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: navy,
        },
      },
      h(
        "div",
        { style: { width: 134, height: 134, display: "flex", borderRadius: 34, overflow: "hidden" } },
        tile(134, blue),
      ),
    ),
    480,
    320,
  ),
);
console.log("splash screens written");
