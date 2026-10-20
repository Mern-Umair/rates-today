// Collects today's rates from the official sources and writes public/data/rates.json.
//
// Run by GitHub Actions twice a day (see .github/workflows/rates.yml) and by hand
// with `npm run fetch`. Each source is fetched on its own: when one fails, the
// others still update and the last good value of the failed one is kept, with its
// own date so the page can say how old it is. The script never throws away data.
//
// Sources
//   Dollar (interbank)   sbp.org.pk home page, "USD/ PKR Rates" box (SBP M2M rate)
//   Open market          ECAP closing rates PDF on sbp.org.pk (USD, EUR, GBP, JPY, AED, SAR)
//   Other currencies     Frankfurter (central-bank data) crosses applied to the dollar rate
//   Gold                 World spot price (gold-api.com) × open-market dollar rate
//   Petrol and diesel    OGRA daily price publication PDF
//   LPG                  data/overrides.json, typed in by hand from OGRA's monthly notice
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pdfText } from "./lib/pdf.mjs";
import { crossToPkr, goldFromSpot, parseEcap, parseOgraFuel, parseOgraListing, parseSbpUsd } from "./lib/parse.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(root, "public", "data", "rates.json");
const overridesPath = join(root, "data", "overrides.json");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const BROWSER_HEADERS = {
  "user-agent": USER_AGENT,
  accept: "text/html,application/xhtml+xml,application/pdf,application/json;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
};
const HISTORY_DAYS = 400;
// Every currency the site shows. The ECAP open-market figure is used first where it
// exists; these crosses fill in the rest, and stand in for all of them on a day ECAP is missing.
const CROSS_CURRENCIES = [
  "USD",
  "AED",
  "SAR",
  "GBP",
  "EUR",
  "JPY",
  "QAR",
  "KWD",
  "OMR",
  "BHD",
  "CAD",
  "AUD",
  "CNY",
  "MYR",
  "TRY",
  "INR",
  "BDT",
];

const log = (...parts) => console.log(new Date().toISOString(), ...parts);

async function get(url, { as = "text", tries = 3 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: BROWSER_HEADERS,
        signal: AbortSignal.timeout(30_000),
        redirect: "follow",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (as === "bytes") return Buffer.from(await response.arrayBuffer());
      if (as === "json") return await response.json();
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < tries) await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
  throw lastError;
}

function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

/** Today's date in Pakistan (UTC+5), as YYYY-MM-DD. */
function todayInPakistan() {
  return new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10);
}

function daysAgo(iso, days) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/** The ECAP file for one day is published under a few spellings; try them all. */
function ecapUrls(iso) {
  const [year, month, day] = iso.split("-");
  const monthName = MONTH_NAMES[Number(month) - 1];
  const base = "https://www.sbp.org.pk/assets/document/open-market-closing-exchange-rates";
  return [
    `${base}-${day}-${monthName}-${year}.pdf`,
    `${base}-${Number(day)}-${monthName}-${year}.pdf`,
    `${base}-${day}-${monthName.slice(0, 3)}-${year}.pdf`,
    `${base}-${day}-${monthName}-${year.slice(2)}.pdf`,
  ];
}

// ---------- one function per source; each returns data or null, never throws ----------

async function fetchSbpUsd() {
  try {
    const html = await get("https://www.sbp.org.pk/");
    const parsed = parseSbpUsd(html);
    if (!parsed) throw new Error("USD/PKR box not found on the page");
    log("SBP interbank", parsed.date, parsed.m2m);
    return { ...parsed, source: "State Bank of Pakistan, mark-to-market rate", url: "https://www.sbp.org.pk/" };
  } catch (error) {
    log("SBP interbank failed:", error.message);
    return null;
  }
}

async function fetchEcap(today, lastKnownDate) {
  // Walk back day by day; stop once we reach the date already stored.
  for (let back = 0; back <= 10; back++) {
    const day = daysAgo(today, back);
    if (lastKnownDate && day <= lastKnownDate) break;
    for (const url of ecapUrls(day)) {
      try {
        const response = await fetch(url, { headers: BROWSER_HEADERS, signal: AbortSignal.timeout(30_000) });
        if (response.status === 503 || response.status === 429) {
          log("ECAP: the server is rate limiting, stopping for this run");
          return null;
        }
        if (!response.ok || !(response.headers.get("content-type") ?? "").includes("pdf")) continue;
        const parsed = parseEcap(await pdfText(Buffer.from(await response.arrayBuffer())));
        if (!parsed) continue;
        log("ECAP open market", parsed.date, parsed.rates.USD);
        return { ...parsed, source: "Exchange Companies Association of Pakistan (ECAP), published by SBP", url };
      } catch (error) {
        log("ECAP try failed:", url, error.message);
      }
    }
  }
  log("ECAP: no newer file found");
  return null;
}

async function fetchCrosses() {
  try {
    const rows = await get("https://api.frankfurter.dev/v2/rates?base=USD", { as: "json" });
    const crosses = {};
    for (const row of rows) {
      if (row.base === "USD" && row.rate > 0) crosses[row.quote] = { rate: row.rate, date: row.date };
    }
    log("crosses", Object.keys(crosses).length, "currencies");
    return crosses;
  } catch (error) {
    log("crosses failed:", error.message);
    return null;
  }
}

async function fetchGoldSpot() {
  try {
    const gold = await get("https://api.gold-api.com/price/XAU", { as: "json" });
    if (!(gold.price > 0)) throw new Error("no gold price in the response");
    let silver = null;
    try {
      const xag = await get("https://api.gold-api.com/price/XAG", { as: "json", tries: 1 });
      if (xag.price > 0) silver = xag.price;
    } catch {
      // Silver is optional.
    }
    log("gold spot", gold.price, "silver", silver);
    return { gold: gold.price, silver, updated: gold.updatedAt ?? new Date().toISOString() };
  } catch (error) {
    log("gold spot failed:", error.message);
    return null;
  }
}

async function fetchOgraFuel(lastKnownDate) {
  try {
    const listing = parseOgraListing(await get("https://ogra.org.pk/price-publications"));
    const newest = listing[0];
    if (!newest) throw new Error("no price publication found on the page");
    if (lastKnownDate && newest.date <= lastKnownDate) {
      log("OGRA: no newer publication than", lastKnownDate);
      return null;
    }
    const parsed = parseOgraFuel(await pdfText(await get(newest.url, { as: "bytes" })));
    if (!parsed) throw new Error("prices not found in the publication");
    log("OGRA fuel", parsed.date, parsed.petrol, parsed.diesel);
    return { ...parsed, source: "Oil and Gas Regulatory Authority (OGRA), daily price publication", url: newest.url };
  } catch (error) {
    log("OGRA fuel failed:", error.message);
    return null;
  }
}

// ---------- merge into the stored file ----------

function upsertHistory(list, entry) {
  const rows = (list ?? []).filter((row) => row.date !== entry.date);
  rows.push(entry);
  rows.sort((a, b) => (a.date < b.date ? -1 : 1));
  return rows.slice(-HISTORY_DAYS);
}

async function main() {
  const previous = readJson(outputPath, {});
  const overrides = readJson(overridesPath, {});
  const today = todayInPakistan();
  const next = { ...previous, updated: new Date().toISOString(), history: { ...(previous.history ?? {}) } };

  const [interbank, openMarket, crosses, spot, fuel] = await Promise.all([
    fetchSbpUsd(),
    fetchEcap(today, previous.openMarket?.date),
    fetchCrosses(),
    fetchGoldSpot(),
    fetchOgraFuel(previous.fuel?.date),
  ]);

  if (interbank) {
    next.interbank = interbank;
    next.history.interbank = upsertHistory(next.history.interbank, { date: interbank.date, usd: interbank.m2m });
  }
  if (openMarket) {
    next.openMarket = openMarket;
    next.history.openMarket = upsertHistory(next.history.openMarket, { date: openMarket.date, ...openMarket.rates });
  }

  // The dollar rate everything else hangs on: open market first, then interbank,
  // then the central-bank reference cross, so gold and the other currencies never go missing.
  if (crosses?.PKR?.rate) {
    next.reference = {
      date: crosses.PKR.date,
      usd: Math.round(crosses.PKR.rate * 100) / 100,
      source: "Frankfurter central-bank reference rate",
    };
  }
  const usdSell = next.openMarket?.rates?.USD?.sell ?? next.interbank?.m2m ?? next.reference?.usd;
  if (crosses && usdSell) {
    const others = {};
    for (const code of CROSS_CURRENCIES) {
      const cross = crosses[code];
      if (cross) others[code] = { rate: crossToPkr(usdSell, cross.rate), date: cross.date };
    }
    next.otherCurrencies = {
      basis: next.openMarket?.rates?.USD?.sell
        ? "open-market dollar selling rate"
        : next.interbank?.m2m
          ? "SBP interbank dollar rate"
          : "central-bank reference dollar rate",
      source: "Frankfurter (central-bank reference rates) applied to the dollar rate",
      rates: others,
    };
  }

  if (spot && usdSell) {
    const premiumPct = Number(overrides.goldPremiumPct ?? 0);
    const prices = goldFromSpot({ spotUsdOz: spot.gold, usdPkr: usdSell, premiumPct });
    next.gold = {
      date: today,
      updated: spot.updated,
      spotUsdOz: spot.gold,
      usdPkr: usdSell,
      premiumPct,
      ...prices,
      silverSpotUsdOz: spot.silver,
      silverTola: spot.silver ? Math.round((spot.silver / 31.1035) * usdSell * 11.6638) : null,
      source: "World spot price (gold-api.com) converted at the open-market dollar rate",
    };
    next.history.gold = upsertHistory(next.history.gold, {
      date: today,
      tola24k: prices.tola24k,
      spotUsdOz: spot.gold,
    });
  }

  if (fuel) {
    next.fuel = fuel;
    next.history.fuel = upsertHistory(next.history.fuel, {
      date: fuel.date,
      petrol: fuel.petrol,
      diesel: fuel.diesel ?? null,
    });
  }

  if (overrides.lpg?.perKg) {
    next.lpg = {
      ...overrides.lpg,
      source: "OGRA monthly LPG price notification, entered by hand",
      url: "https://ogra.org.pk/lpg-notified-prices",
    };
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(next, null, 2)}\n`);
  const got = [
    interbank && "interbank",
    openMarket && "open market",
    crosses && "crosses",
    spot && "gold",
    fuel && "fuel",
  ]
    .filter(Boolean)
    .join(", ");
  log(`wrote ${outputPath} (${got || "nothing new"})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
