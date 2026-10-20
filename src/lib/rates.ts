// The rates file that scripts/fetch-rates.mjs writes, typed, plus the small
// calculations the pages share. Pages import the JSON at build time, and the
// RatesRefresher component fetches the same file again in the browser so a page
// that was built in the morning still shows the evening's numbers.
import data from "../../public/data/rates.json";

export type BuySell = { buy: number; sell: number };

export type Rates = {
  updated: string;
  interbank?: { date: string; m2m: number; bid: number | null; offer: number | null; source: string; url: string };
  openMarket?: { date: string; rates: Record<string, BuySell>; source: string; url: string };
  reference?: { date: string; usd: number; source: string };
  otherCurrencies?: { basis: string; source: string; rates: Record<string, { rate: number; date: string }> };
  gold?: {
    date: string;
    updated: string;
    spotUsdOz: number;
    usdPkr: number;
    premiumPct: number;
    gram24k: number;
    tola24k: number;
    tenGram24k: number;
    gram22k: number;
    tola22k: number;
    tenGram22k: number;
    tola21k: number;
    tola18k: number;
    silverSpotUsdOz: number | null;
    silverTola: number | null;
    source: string;
  };
  fuel?: { date: string; petrol: number; diesel?: number; source: string; url: string };
  lpg?: { date: string; perKg: number; cylinder11kg?: number; source: string; url: string };
  history: {
    interbank?: { date: string; usd: number }[];
    openMarket?: ({ date: string } & Record<string, BuySell | string>)[];
    gold?: { date: string; tola24k: number; spotUsdOz: number }[];
    fuel?: { date: string; petrol: number; diesel: number | null }[];
  };
};

export const rates = data as unknown as Rates;

/** Rupees per unit of a currency: open market selling rate where ECAP publishes one, else the cross. */
export function pkrFor(
  code: string,
  source: Rates = rates,
): { rate: number; date: string; kind: "open-market" | "indicative" } | null {
  const open = source.openMarket?.rates[code];
  if (open) return { rate: open.sell, date: source.openMarket!.date, kind: "open-market" };
  if (code === "USD") {
    if (source.interbank) return { rate: source.interbank.m2m, date: source.interbank.date, kind: "indicative" };
    if (source.reference) return { rate: source.reference.usd, date: source.reference.date, kind: "indicative" };
  }
  const other = source.otherCurrencies?.rates[code];
  if (other) return { rate: other.rate, date: other.date, kind: "indicative" };
  return null;
}

/** "Rs 279.15" or "Rs 432,200" — whole rupees above 1,000, two decimals below. */
export function rs(value: number | null | undefined, decimals?: number): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  const places = decimals ?? (Math.abs(value) >= 1000 ? 0 : 2);
  return `Rs ${value.toLocaleString("en-PK", { minimumFractionDigits: places, maximumFractionDigits: places })}`;
}

/** "20 October 2026" from "2026-10-20". */
export function longDate(iso: string | undefined): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Change against the previous entry in a history list, for the "up Rs 1.20" badge. */
export function changeFrom<T extends { date: string }>(
  list: T[] | undefined,
  pick: (row: T) => number | null | undefined,
): { delta: number; since: string } | null {
  if (!list || list.length < 2) return null;
  const latest = pick(list[list.length - 1]);
  const previous = pick(list[list.length - 2]);
  if (latest == null || previous == null) return null;
  return { delta: Math.round((latest - previous) * 100) / 100, since: list[list.length - 2].date };
}

export const GRAMS_PER_TOLA = 11.6638;

/** "October 2026" from "2026-10-01", for monthly figures such as LPG. */
export function monthYear(iso: string | undefined): string {
  if (!iso) return "";
  const [year, month] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
