import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd, pageData } from "@/components/JsonLd";
import { GoldCityTable, GoldSection } from "@/components/RateSections";
import { ShareRates } from "@/components/ShareRates";
import { Updated } from "@/components/Updated";
import { pageMeta } from "@/lib/meta";
import { changeFrom, GRAMS_PER_TOLA, longDate, rates, rs } from "@/lib/rates";

const gold = rates.gold;
const date = longDate(gold?.date ?? rates.updated.slice(0, 10));
const path = "/gold-rate-today-pakistan";
const change = changeFrom(rates.history.gold, (row) => row.tola24k);
const movement = change
  ? change.delta === 0
    ? `unchanged from ${longDate(change.since)}`
    : `${change.delta > 0 ? "up" : "down"} ${rs(Math.abs(change.delta))} from ${longDate(change.since)}`
  : "";

const title = `Gold Rate Today in Pakistan: 24k ${rs(gold?.tola24k)}, 22k ${rs(gold?.tola22k)} per Tola (${date})`;
const description = `Today's gold rate in Pakistan: 24 karat ${rs(gold?.tola24k)} per tola and ${rs(gold?.tenGram24k)} per 10 grams; 22 karat ${rs(gold?.tola22k)} per tola; 21k and 18k too. From the international gold price at today's dollar rate, with silver, the rate by city and a 30-day chart.`;

export const metadata: Metadata = pageMeta({ title, description, path });

const lead = gold
  ? `As of ${date}, the gold rate in Pakistan is ${rs(gold.tola24k)} per tola for 24 karat and ${rs(gold.tola22k)} per tola for 22 karat (${rs(gold.tenGram24k)} per 10 grams, ${rs(gold.gram24k)} per gram of 24k), from the international price of $${gold.spotUsdOz.toLocaleString("en-US", { maximumFractionDigits: 2 })} per ounce at ${rs(gold.usdPkr)} per dollar${movement ? `; the 24k tola rate is ${movement}` : ""}.`
  : `The gold rate for ${date} has not been read yet; it appears here as soon as the international price is in.`;

const faq = [
  {
    q: "What is the gold rate today in Pakistan per tola?",
    a: gold
      ? `24 karat gold is ${rs(gold.tola24k)} per tola and 22 karat is ${rs(gold.tola22k)} per tola as of ${date}. Per 10 grams, 24k is ${rs(gold.tenGram24k)}. The figure is the international price converted at today's dollar rate; a jeweller adds making charges on top.`
      : "The figure appears at the top of this page as soon as the day's international price is read.",
  },
  {
    q: "Aaj sone ka rate kya hai?",
    a: gold
      ? `Aaj (${date}) 24 karat sona ${rs(gold.tola24k)} fi tola aur 22 karat ${rs(gold.tola22k)} fi tola hai. 10 gram 24k ${rs(gold.tenGram24k)} ka hai. Yeh international rate ko aaj ke dollar rate par rupees mein badal kar nikala gaya hai; sunaar is par banwai alag lagata hai.`
      : "Aaj ka rate thori dair mein is page par aa jayega.",
  },
  {
    q: "What is the 1 tola gold price in Pakistan today?",
    a: gold
      ? `${rs(gold.tola24k)} for one tola of 24 karat gold and ${rs(gold.tola22k)} for 22 karat, as of ${date}. One tola is ${GRAMS_PER_TOLA} grams.`
      : "The one-tola price is the first figure on this page once the day's rate is in.",
  },
  {
    q: "Is the gold rate different in Lahore, Karachi and Islamabad?",
    a: "Only slightly. The Karachi Sarafa association's rate is the national reference and the Lahore, Islamabad, Rawalpindi, Peshawar and other city associations announce rates that follow it, usually within a few hundred rupees per tola. The table on this page shows the same international-price figure for every city; the local association rate of the day may sit a little above or below it.",
  },
  {
    q: "How is the gold rate in Pakistan worked out?",
    a: "Gold is priced worldwide in US dollars per troy ounce (31.1035 grams). Multiply by the dollar rate in rupees, divide by 31.1035 for a gram, and multiply by 11.6638 for a tola. That is the figure on this page. The Sarafa (jewellers') associations in Karachi and Lahore announce a rate each day that follows the same arithmetic, usually within one percent.",
  },
  {
    q: "Why does the jeweller quote more than this rate?",
    a: "The jeweller's price includes making charges (labour), which range from a few percent for plain bangles to much more for detailed sets, and sometimes a small premium over the association rate. Ask for the gold rate and the making charge separately.",
  },
  {
    q: "What is the difference between 24k, 22k and 21k gold?",
    a: "Karat is purity out of 24. 24k is pure gold; 22k is 91.7% gold and is the usual standard for jewellery in Pakistan; 21k is 87.5%. The price per tola falls in the same proportion, which is how the table above is worked out.",
  },
  {
    q: "How many grams is a tola?",
    a: "One tola is 11.6638 grams. Ten grams is slightly less than a tola, so the 10-gram rate is always a little lower than the tola rate.",
  },
  {
    q: "When does the gold rate change?",
    a: "The world price moves all day while markets are open, and the rupee moves with it. This page updates twice a day; the Sarafa associations announce their rate once or twice a day.",
  },
];

export default function GoldPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Gold rate today in Pakistan per tola (24k, 22k, 21k)
      </h1>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <Updated date={gold?.date} source={gold?.source} />
        <ShareRates kind="gold" />
      </div>
      <p className="lead mt-4 max-w-3xl text-lg">{lead}</p>
      <p className="mt-3 max-w-3xl text-muted">
        Today’s gold rate per tola, per 10 grams and per gram for 24, 22, 21 and 18 karat, the silver rate, the rate by
        city, and a chart of the last month.
      </p>

      <div className="mt-6">
        <GoldSection />
      </div>

      <section className="mt-10" aria-labelledby="cities">
        <h2 id="cities" className="text-2xl font-semibold tracking-tight">
          Gold rate today in Lahore, Karachi, Islamabad and other cities
        </h2>
        <p className="mt-2 text-muted">
          24k and 22k per tola and 24k per 10 grams, {date}. One national reference rate, so every city shows the same
          figure; the note under the table explains the small local differences.
        </p>
        <div className="mt-4">
          <GoldCityTable />
        </div>
      </section>

      <section className="prose mt-10">
        <h2>International gold rate today</h2>
        <p>
          {gold
            ? `Gold is trading at $${gold.spotUsdOz.toLocaleString("en-US", { maximumFractionDigits: 2 })} per troy ounce on the world market, which is $${(gold.spotUsdOz / 31.1035).toFixed(2)} per gram. At ${rs(gold.usdPkr)} per dollar that gives the rupee figures above.`
            : "The international price per troy ounce appears here with the day's rate."}{" "}
          The international market is the reason gold in Pakistan moves even on days when the rupee is steady.
        </p>
        <h2>Gold and the dollar move together</h2>
        <p>
          The rupee gold rate changes for two reasons: the world price of gold, and the rupee’s rate against the dollar.
          When the rupee weakens, gold in rupees rises even if the world price stands still. Check the{" "}
          <Link href="/dollar-rate-today-pakistan">dollar rate</Link> alongside this page when gold jumps, and the{" "}
          <Link href="/silver-rate-today-pakistan">silver rate</Link> for the other metal.
        </p>
        <h2>Buying gold: what to check</h2>
        <ul>
          <li>Ask for the day’s rate per tola and the making charge separately, and for the purity in karats.</li>
          <li>Weigh the piece in front of you; stones and clasps are not gold.</li>
          <li>Keep the receipt with the rate and weight written on it; resale depends on it.</li>
        </ul>
      </section>

      <Faq items={faq} />
      <JsonLd data={pageData({ name: title, description, path, dateModified: rates.updated })} />
      <JsonLd data={breadcrumbData([{ name: "Gold rate today", path }])} />
    </article>
  );
}
