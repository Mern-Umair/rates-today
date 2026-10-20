// Checks the built pages in `out` after `npm run build`. Run with `npm run test:build`.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { currencyPages, ratePages } from "../src/data/pages.ts";
import { adsenseClient, siteUrl } from "../src/data/site.ts";

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
const fileFor = (path: string) => (path === "" ? "index.html" : `${path.slice(1)}/index.html`);

test("the build exists", () => {
  assert.ok(existsSync(join(out, "index.html")), "run `npm run build` first");
});

test("every page has a title, description, canonical link and share image", () => {
  for (const path of pages) {
    const html = read(fileFor(path));
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    assert.ok(title.length >= 10 && title.length <= 110, `${path}: title "${title}"`);
    assert.match(html, /<meta name="description" content="[^"]{50,}"/, `${path}: description`);
    assert.ok(html.includes(`<link rel="canonical" href="${siteUrl}${path}/"`), `${path}: canonical`);
    assert.ok(html.includes(`${siteUrl}/og.png`), `${path}: share image`);
    assert.ok(
      !/undefined|NaN|\[object Object\]/.test(html.replace(/<script[\s\S]*?<\/script>/g, "")),
      `${path}: stray undefined or NaN`,
    );
  }
});

test("rate pages show a rupee figure, and the AdSense tag only when an ID is set", () => {
  for (const page of ratePages) {
    const html = read(fileFor(page.href));
    assert.equal(html.includes("google-adsense-account"), adsenseClient !== "", `${page.href}: adsense meta`);
    assert.ok(
      !html.includes("pagead2.googlesyndication"),
      `${page.href}: AdSense script must not be inline (the app shell must never load it)`,
    );
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
    const url = `<loc>${siteUrl}${path}/</loc>`;
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

test("answer-first lead, page dates, snippet controls, llms.txt and crawler rules", () => {
  const llms = read("llms.txt");
  for (const page of ratePages) assert.ok(llms.includes(`${page.href}/`), `${page.href} listed in llms.txt`);
  for (const page of currencyPages) assert.ok(llms.includes(`/${page.slug}/`), `${page.slug} listed in llms.txt`);
  assert.ok(read("robots.txt").includes("GPTBot"), "AI crawlers named in robots.txt");
  for (const path of ["", ...ratePages.map((page) => page.href), "/aed-to-pkr", "/kwd-to-pkr"]) {
    const html = read(fileFor(path));
    assert.match(html, /name="robots" content="[^"]*max-snippet:-1/, `${path}: snippet controls`);
    assert.match(
      html,
      /class="lead[^"]*"[^>]*>[^<]*Rs [\d,.]+/,
      `${path}: answer-first lead with a figure and no markup inside`,
    );
    assert.ok(html.includes('"dateModified"'), `${path}: WebPage dateModified`);
    assert.ok(html.includes('"speakable"'), `${path}: speakable`);
  }
});

test("city sections and Roman Urdu questions are on the pages people search for", () => {
  const gold = read(fileFor("/gold-rate-today-pakistan"));
  for (const city of ["Lahore", "Karachi", "Islamabad", "Peshawar", "Faisalabad", "Multan"])
    assert.ok(gold.includes(city), `gold page: ${city}`);
  assert.ok(gold.includes("Aaj sone ka rate kya hai?"), "gold page: Roman Urdu question");
  const petrol = read(fileFor("/petrol-price-today-pakistan"));
  assert.ok(petrol.includes("Petrol price in Karachi, Lahore, Islamabad"), "petrol page: city heading");
  assert.ok(petrol.includes("Aaj petrol ki qeemat kya hai?"), "petrol page: Roman Urdu question");
  assert.ok(
    read(fileFor("/dollar-rate-today-pakistan")).includes("Interbank dollar rate today"),
    "dollar page: interbank heading",
  );
  const lpg = read(fileFor("/lpg-price-today-pakistan"));
  assert.match(lpg, /11\.8 kg/, "lpg page: domestic cylinder");
  assert.match(read(fileFor("/silver-rate-today-pakistan")), /per tola/i, "silver page: per tola");
});
