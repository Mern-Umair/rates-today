// Checks the built pages in `out` after `npm run build`. Run with `npm run test:build`.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { currencyPages, ratePages } from "../src/data/pages.ts";
import { siteUrl } from "../src/data/site.ts";

const out = join(import.meta.dirname, "..", "out");
const read = (file: string) => readFileSync(join(out, file), "utf8");
const pages = [
  "",
  ...ratePages.map((page) => page.href),
  ...currencyPages.map((page) => `/${page.slug}`),
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];
const fileFor = (path: string) => (path === "" ? "index.html" : `${path.slice(1)}.html`);

test("the build exists", () => {
  assert.ok(existsSync(join(out, "index.html")), "run `npm run build` first");
});

test("every page has a title, description, canonical link and share image", () => {
  for (const path of pages) {
    const html = read(fileFor(path));
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    assert.ok(title.length >= 10 && title.length <= 110, `${path}: title "${title}"`);
    assert.match(html, /<meta name="description" content="[^"]{50,}"/, `${path}: description`);
    assert.ok(html.includes(`<link rel="canonical" href="${siteUrl}${path}"`), `${path}: canonical`);
    assert.ok(html.includes(`${siteUrl}/og.png`), `${path}: share image`);
    assert.ok(!/undefined|NaN|\[object Object\]/.test(html.replace(/<script[\s\S]*?<\/script>/g, "")), `${path}: stray undefined or NaN`);
  }
});

test("rate pages carry the AdSense tag and show a rupee figure", () => {
  for (const page of ratePages) {
    const html = read(fileFor(page.href));
    assert.ok(html.includes("google-adsense-account"), `${page.href}: adsense meta`);
    assert.match(html, /Rs [\d,]+/, `${page.href}: a rupee figure`);
  }
});

test("the data file is served and the home page is built from it", () => {
  const data = JSON.parse(read("data/rates.json"));
  assert.ok(data.updated, "updated stamp");
  assert.ok(data.fuel?.petrol > 100, "petrol price present");
  assert.ok(data.gold?.tola24k > 100000, "gold price present");
  const home = read("index.html");
  assert.ok(home.includes(String(data.fuel.petrol)), "home shows the petrol price from the data file");
});

test("sitemap lists every page once and robots points at it", () => {
  const sitemap = read("sitemap.xml");
  for (const path of pages) {
    const url = `<loc>${siteUrl}${path}</loc>`;
    assert.equal(sitemap.split(url).length - 1, 1, `${path} in sitemap once`);
  }
  assert.ok(read("robots.txt").includes(`${siteUrl}/sitemap.xml`));
});

test("structured data on the home and FAQ pages is valid JSON", () => {
  for (const path of ["", "/dollar-rate-today-pakistan", "/aed-to-pkr"]) {
    const html = read(fileFor(path));
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(blocks.length >= 1, `${path}: json-ld present`);
    for (const block of blocks) assert.doesNotThrow(() => JSON.parse(block[1]), `${path}: json-ld parses`);
  }
});
