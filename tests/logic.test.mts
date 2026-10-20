// Checks the parsers against saved copies of the real publications.
// Run with `npm test`.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { pdfText } from "../scripts/lib/pdf.mjs";
import {
  crossToPkr,
  goldFromSpot,
  isoDate,
  parseEcap,
  parseOgraFuel,
  parseOgraListing,
  parseSbpUsd,
} from "../scripts/lib/parse.mjs";

const fixture = (name: string) => join(import.meta.dirname, "fixtures", name);

test("dates in every spelling the sources use", () => {
  assert.equal(isoDate("19- Oct - 2026"), "2026-10-19");
  assert.equal(isoDate("16-Oct-26"), "2026-10-16");
  assert.equal(isoDate("09- October - 2026"), "2026-10-09");
  assert.equal(isoDate("September 4, 2026"), "2026-09-04");
  assert.equal(isoDate("October 20, 2026"), "2026-10-20");
  assert.equal(isoDate("no date here"), null);
});

test("SBP home page: the USD/PKR box", () => {
  const html = readFileSync(fixture("sbp-home-2026-10-20.html"), "utf8");
  const usd = parseSbpUsd(html);
  assert.deepEqual(usd, { date: "2026-10-19", m2m: 276.9022, bid: 276.595, offer: 277.0518 });
  assert.equal(parseSbpUsd("<html>nothing</html>"), null);
});

test("ECAP open-market PDF: six currencies with buying and selling", async () => {
  const text = await pdfText(readFileSync(fixture("ecap-2026-09-04.pdf")));
  const ecap = parseEcap(text);
  assert.ok(ecap);
  assert.equal(ecap.date, "2026-09-04");
  assert.deepEqual(ecap.rates.USD, { buy: 278.29, sell: 279.15 });
  assert.deepEqual(ecap.rates.AED, { buy: 75.68, sell: 76.29 });
  assert.deepEqual(ecap.rates.SAR, { buy: 73.95, sell: 74.49 });
  assert.deepEqual(Object.keys(ecap.rates), ["USD", "EUR", "GBP", "JPY", "AED", "SAR"]);
  assert.equal(parseEcap("Open Market Closing Exchange Rates as on September 4, 2026 | nothing"), null);
});

test("OGRA listing: newest publication first with its English link", () => {
  const html = readFileSync(fixture("ogra-listing-2026-10-20.html"), "utf8");
  const listing = parseOgraListing(html);
  assert.ok(listing.length >= 4);
  assert.deepEqual(listing[0], { date: "2026-10-20", url: "https://ogra.org.pk/download/17375?lang=en" });
  assert.ok(listing.every((entry, index) => index === 0 || entry.date <= listing[index - 1].date));
});

test("OGRA fuel PDF: petrol and diesel totals", async () => {
  const text = await pdfText(readFileSync(fixture("ogra-petrol-2026-10-20.pdf")));
  const fuel = parseOgraFuel(text);
  assert.deepEqual(fuel, { date: "2026-10-20", petrol: 381.14, diesel: 389.27 });
  assert.equal(parseOgraFuel("Price Effective October 20, 2026 | no totals"), null);
});

test("gold from the spot price matches the market rate within a percent", () => {
  // 20 Oct 2026: spot $4,122/oz, dollar Rs 279; gold.pk showed Rs 432,200 per tola 24k.
  const gold = goldFromSpot({ spotUsdOz: 4122.3, usdPkr: 279.15 });
  assert.ok(gold);
  assert.ok(Math.abs(gold.tola24k - 432200) / 432200 < 0.01, `tola ${gold.tola24k}`);
  assert.ok(Math.abs(gold.tenGram24k - gold.gram24k * 10) <= 5);
  assert.ok(gold.tola22k < gold.tola24k && gold.tola21k < gold.tola22k && gold.tola18k < gold.tola21k);
  assert.equal(goldFromSpot({ spotUsdOz: 0, usdPkr: 279 }), null);
  const withPremium = goldFromSpot({ spotUsdOz: 4122.3, usdPkr: 279.15, premiumPct: 1 });
  assert.ok(withPremium && withPremium.tola24k > gold.tola24k);
});

test("other currencies from the dollar rate and a cross", () => {
  assert.equal(crossToPkr(279.15, 3.6725), 76.01); // AED
  assert.equal(crossToPkr(279.15, 0.3075), 907.8); // KWD
  assert.equal(crossToPkr(0, 3.6725), null);
});
