// Draws the site's icons and share image as plain PNG files.
// A static site has no server to draw them on request, so they are made once
// and kept in the repository. Run `npm run images` after changing the logo or the wording.
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const logo = (size) =>
  h(
    "svg",
    { width: size, height: size, viewBox: "0 0 36 36" },
    h("rect", { width: 36, height: 36, rx: 9, fill: "#1d4ed8" }),
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

// The mark plus its "Rs" label, drawn as HTML so the image renderer can place the text.
const mark = (size) =>
  h(
    "div",
    { style: { position: "relative", width: size, height: size, display: "flex" } },
    logo(size),
    h(
      "div",
      {
        style: {
          position: "absolute",
          left: size * 0.2,
          top: size * 0.13,
          fontSize: size * 0.3,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1,
        },
      },
      "Rs",
    ),
  );

// Phones mask home-screen icons, so those get a full-bleed square with the mark inside.
const appIcon = (size) =>
  h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1d4ed8",
      },
    },
    mark(Math.round(size * 0.86)),
  );

const share = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 72,
      background: "#0f2a5f",
      color: "#ffffff",
    },
  },
  h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 24 } },
    mark(88),
    h("div", { style: { fontSize: 56, fontWeight: 700 } }, "Rates Today"),
  ),
  h(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 24 } },
    h(
      "div",
      { style: { fontSize: 76, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 } },
      "Dollar, gold and petrol rates in Pakistan today",
    ),
    h(
      "div",
      { style: { fontSize: 34, color: "#c7d6f2" } },
      "Open market · Interbank · Gold per tola · OGRA petrol · AED, SAR, GBP to PKR",
    ),
  ),
);

const images = [
  ["src/app/icon.png", mark(96), 96, 96],
  ["src/app/apple-icon.png", appIcon(180), 180, 180],
  ["public/icon-192.png", appIcon(192), 192, 192],
  ["public/icon-512.png", appIcon(512), 512, 512],
  ["public/og.png", share, 1200, 630],
];

for (const [file, element, width, height] of images) {
  const response = new ImageResponse(element, { width, height });
  const bytes = Buffer.from(await response.arrayBuffer());
  const path = join(root, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, bytes);
  console.log(`${file}  ${width}x${height}  ${(bytes.length / 1024).toFixed(1)} KB`);
}

// Browsers ask for these two files by name even though the pages never link to them:
// every browser tries /favicon.ico and iPhones try /apple-touch-icon.png. Serving them
// avoids a 404 on each visit. An .ico file may simply wrap a PNG (Windows Vista and later).
function pngToIco(png, size) {
  const header = Buffer.alloc(6 + 16);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size, 6); // width (0 would mean 256)
  header.writeUInt8(size, 7); // height
  header.writeUInt8(0, 8); // colours in palette
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14); // image size
  header.writeUInt32LE(22, 18); // offset of the image data
  return Buffer.concat([header, png]);
}

const favicon = pngToIco(Buffer.from(await new ImageResponse(mark(48), { width: 48, height: 48 }).arrayBuffer()), 48);
writeFileSync(join(root, "public/favicon.ico"), favicon);
console.log(`public/favicon.ico  48x48  ${(favicon.length / 1024).toFixed(1)} KB`);

copyFileSync(join(root, "src/app/apple-icon.png"), join(root, "public/apple-touch-icon.png"));
console.log("public/apple-touch-icon.png  copied from src/app/apple-icon.png");
