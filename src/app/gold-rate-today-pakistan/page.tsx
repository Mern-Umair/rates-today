import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd } from "@/components/JsonLd";
import { GoldSection } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { pageMeta } from "@/lib/meta";
import { longDate, rates, rs } from "@/lib/rates";

const gold = rates.gold;

export const metadata: Metadata = pageMeta({
  title: `Gold Rate Today in Pakistan: 24k ${rs(gold?.tola24k)} per Tola (${longDate(gold?.date)})`,
  description: `Today's gold rate in Pakistan: 24 karat ${rs(gold?.tola24k)} per tola, ${rs(gold?.tenGram24k)} per 10 grams; 22 karat ${rs(gold?.tola22k)} per tola. From the world gold price at today's dollar rate, updated daily, with silver and a chart.`,
  path: "/gold-rate-today-pakistan",
});

const faq = [
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
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Gold rate today in Pakistan</h1>
      <Updated date={gold?.date} source={gold?.source} />
      <p className="mt-4 max-w-3xl text-muted">
        Today’s gold rate per tola, per 10 grams and per gram for 24, 22, 21 and 18 karat, the silver rate, and a chart
        of the last month. Worked out from the world gold price at today’s dollar rate.
      </p>

      <div className="mt-6">
        <GoldSection />
      </div>

      <section className="prose mt-10">
        <h2>Gold and the dollar move together</h2>
        <p>
          The rupee gold rate changes for two reasons: the world price of gold, and the rupee’s rate against the dollar.
          When the rupee weakens, gold in rupees rises even if the world price stands still. Check the{" "}
          <Link href="/dollar-rate-today-pakistan">dollar rate</Link> alongside this page when gold jumps.
        </p>
        <h2>Buying gold: what to check</h2>
        <ul>
          <li>Ask for the day’s rate per tola and the making charge separately, and for the purity in karats.</li>
          <li>Weigh the piece in front of you; stones and clasps are not gold.</li>
          <li>Keep the receipt with the rate and weight written on it; resale depends on it.</li>
        </ul>
      </section>

      <Faq items={faq} />
      <JsonLd data={breadcrumbData([{ name: "Gold rate today", path: "/gold-rate-today-pakistan" }])} />
    </article>
  );
}
