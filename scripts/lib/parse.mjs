// Pure functions that turn the official publications into numbers.
// Each one takes text (HTML or PDF text) and returns plain data, or null when the
// text does not contain what it should. Nothing here touches the network, so every
// function is covered by tests against saved copies of the real documents.

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "19- Oct - 2026", "September 4, 2026", "October 20, 2026" → "2026-10-19". */
export function isoDate(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  // Day first: 19-Oct-2026, 19 October 2026, 16-Oct-26
  let match = cleaned.match(/(\d{1,2})\s*-?\s*([A-Za-z]{3,9})\s*-?\s*(\d{2,4})/);
  let day;
  let month;
  let year;
  if (match) {
    [, day, month, year] = match;
  } else {
    // Month first: October 20, 2026
    match = cleaned.match(/([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})/);
    if (!match) return null;
    [, month, day, year] = match;
  }
  const monthIndex = MONTHS.indexOf(month.slice(0, 3).toLowerCase());
  if (monthIndex < 0) return null;
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function number(text) {
  const value = Number(String(text).replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

/**
 * The "USD/ PKR Rates" box on sbp.org.pk: the date, the mark-to-market
 * revaluation rate and the weighted average bid and offer.
 */
export function parseSbpUsd(html) {
  const start = html.indexOf("USD/ PKR Rates");
  if (start < 0) return null;
  const box = html.slice(start, start + 4000).replace(/<[^>]+>/g, " ");
  const date = box.match(/As on\s+([^\n]+?)\s{2,}/)?.[1] ?? box.match(/As on\s+([\d\s-]+[A-Za-z]+[\s-]+\d{2,4})/)?.[1];
  const m2m = box.match(/M2M Revaluation Rate\s+([\d.]+)/)?.[1];
  const bid = box.match(/BID\s+([\d.]+)/)?.[1];
  const offer = box.match(/Offer\s+([\d.]+)/)?.[1];
  if (!date || !m2m) return null;
  const iso = isoDate(date);
  if (!iso) return null;
  return { date: iso, m2m: number(m2m), bid: number(bid), offer: number(offer) };
}

const ECAP_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AED", "SAR"];

/** The ECAP "Open Market Closing Exchange Rates" PDF: buying and selling per currency. */
export function parseEcap(text) {
  const date = text.match(/as on\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i)?.[1];
  if (!date) return null;
  /** @type {Record<string, { buy: number, sell: number }>} */
  const rates = {};
  for (const code of ECAP_CURRENCIES) {
    const match = text.match(new RegExp(`\\b${code}\\s*\\|\\s*([\\d.,]+)\\s*\\|\\s*([\\d.,]+)`));
    if (!match) continue;
    const buy = number(match[1]);
    const sell = number(match[2]);
    if (buy && sell && sell >= buy) rates[code] = { buy, sell };
  }
  if (!rates.USD) return null;
  return { date: isoDate(date), rates };
}

/** The OGRA price publications page: newest first, with the English download link. */
export function parseOgraListing(html) {
  const entries = [];
  const pattern = /Price Publications Effective Dated\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})[\s\S]*?href="(https:\/\/ogra\.org\.pk\/download\/\d+)\?lang=en"/g;
  for (const match of html.matchAll(pattern)) {
    const date = isoDate(match[1]);
    if (date) entries.push({ date, url: `${match[2]}?lang=en` });
  }
  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** The OGRA daily price publication PDF: petrol and diesel in rupees per litre. */
export function parseOgraFuel(text) {
  const date = text.match(/Price Effective\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/)?.[1];
  const petrol = text.match(/Total Petrol Price[^|]*\|[^|]*\|[^|]*\|[^|]*\|\s*([\d.,]+)/)?.[1];
  const diesel = text.match(/Total Diesel Price[^|]*\|[^|]*\|[^|]*\|[^|]*\|\s*([\d.,]+)/)?.[1];
  if (!date || !petrol) return null;
  const result = { date: isoDate(date), petrol: number(petrol) };
  if (diesel) result.diesel = number(diesel);
  return result;
}

export const GRAMS_PER_TOLA = 11.6638;
export const GRAMS_PER_TROY_OUNCE = 31.1035;

/**
 * Gold in rupees from the world spot price. The Sarafa (jewellers) rate follows
 * spot × dollar rate closely; `premiumPct` lets a small local premium be added.
 */
export function goldFromSpot({ spotUsdOz, usdPkr, premiumPct = 0 }) {
  if (!(spotUsdOz > 0) || !(usdPkr > 0)) return null;
  const gram24k = (spotUsdOz / GRAMS_PER_TROY_OUNCE) * usdPkr * (1 + premiumPct / 100);
  const round = (value) => Math.round(value);
  const karat = (k) => gram24k * (k / 24);
  return {
    gram24k: round(gram24k),
    tola24k: round(gram24k * GRAMS_PER_TOLA),
    tenGram24k: round(gram24k * 10),
    gram22k: round(karat(22)),
    tola22k: round(karat(22) * GRAMS_PER_TOLA),
    tenGram22k: round(karat(22) * 10),
    tola21k: round(karat(21) * GRAMS_PER_TOLA),
    tola18k: round(karat(18) * GRAMS_PER_TOLA),
  };
}

/** Rupees per unit of another currency, from rupees per dollar and dollars-to-currency crosses. */
export function crossToPkr(usdPkr, usdToCurrency) {
  if (!(usdPkr > 0) || !(usdToCurrency > 0)) return null;
  return Math.round((usdPkr / usdToCurrency) * 100) / 100;
}
