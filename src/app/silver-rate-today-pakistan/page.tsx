import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd, pageData } from "@/components/JsonLd";
import { SilverSection } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { pageMeta } from "@/lib/meta";
import { GRAMS_PER_TOLA, longDate, rates, rs } from "@/lib/rates";

const gold = rates.gold;
const tola = gold?.silverTola ?? null;
const gram = tola ? tola / GRAMS_PER_TOLA : null;
const date = longDate(gold?.date ?? rates.updated.slice(0, 10));
const path = "/silver-rate-today-pakistan";

const title = `Silver Rate Today in Pakistan: ${rs(tola)} per Tola, ${rs(gram)} per Gram (${date})`;
const description = `Today's silver rate in Pakistan: ${rs(tola)} per tola, ${rs(gram ? gram * 10 : null)} per 10 grams and ${rs(gram ? gram * 1000 : null)} per kilogram, from the international silver price at today's dollar rate. Updated twice a day.`;

export const metadata: Metadata = pageMeta({ title, description, path });

const lead = tola
  ? `As of ${date}, the silver rate in Pakistan is ${rs(tola)} per tola (${rs(gram)} per gram), worked out from the international silver price of $${gold?.silverSpotUsdOz?.toFixed(2)} per troy ounce at ${rs(gold?.usdPkr)} per dollar.`
  : `The silver rate for ${date} has not been read yet; it appears here as soon as the international price is in.`;

const faq = [
  {
    q: "What is the silver rate today in Pakistan per tola?",
    a: tola
      ? `${rs(tola)} per tola as of ${date}. That is the international price per troy ounce converted into rupees at today's dollar rate and then into a tola of ${GRAMS_PER_TOLA} grams.`
      : "The figure appears at the top of this page as soon as the day's international price is read.",
  },
  {
    q: "Aaj chandi ka rate kya hai?",
    a: tola
      ? `Aaj (${date}) chandi ka rate ${rs(tola)} fi tola hai, yani ${rs(gram)} fi gram. Yeh international silver price ko aaj ke dollar rate par rupees mein badal kar nikala gaya hai; sunaar thori kam ya zyada qeemat laga sakta hai.`
      : "Aaj ka rate thori dair mein is page par aa jayega.",
  },
  {
    q: "What is the silver rate in the international market?",
    a: gold?.silverSpotUsdOz
      ? `$${gold.silverSpotUsdOz.toFixed(2)} per troy ounce (31.1035 grams) at the last reading. Silver trades around the clock on world markets; this page reads the price twice a day.`
      : "The international price appears here with the day's rate.",
  },
  {
    q: "Why is the silver rate at the shop different?",
    a: "Silver is sold in smaller quantities than gold, so dealers' margins are wider, and local Sarafa rates can sit a few percent away from the international figure. For jewellery, making charges are added on top. Use this rate as the reference when you compare quotes.",
  },
  {
    q: "How much is silver per kilogram?",
    a: gram
      ? `${rs(gram * 1000)} per kilogram at today's rate, which is 1,000 grams or about 85.7 tolas.`
      : "Multiply the per-gram rate at the top of this page by 1,000.",
  },
];

export default function SilverPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Silver rate today in Pakistan</h1>
      <Updated date={gold?.date} source={gold?.source} />
      <p className="lead mt-4 max-w-3xl text-lg">{lead}</p>
      <div className="mt-6">
        <SilverSection />
      </div>
      <section className="prose mt-10">
        <h2>Silver rate in Karachi, Lahore, Islamabad and other cities</h2>
        <p>
          Silver, like gold, is priced from one international market, so the rate is the same across Pakistan. The
          Karachi Sarafa rate is the reference; a shop in Lahore, Islamabad, Rawalpindi, Peshawar or Faisalabad quotes
          within a small margin of it. Check the <Link href="/gold-rate-today-pakistan">gold rate</Link> and the{" "}
          <Link href="/dollar-rate-today-pakistan">dollar rate</Link> on the same day: when the rupee weakens, silver in
          rupees rises even if the world price does not move.
        </p>
      </section>
      <Faq items={faq} />
      <JsonLd data={pageData({ name: title, description, path, dateModified: rates.updated })} />
      <JsonLd data={breadcrumbData([{ name: "Silver rate today", path }])} />
    </article>
  );
}
