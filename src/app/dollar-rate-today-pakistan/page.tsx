import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd } from "@/components/JsonLd";
import { DollarSection } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { pageMeta } from "@/lib/meta";
import { longDate, pkrFor, rates, rs } from "@/lib/rates";

const usd = pkrFor("USD");
const open = rates.openMarket?.rates.USD;

export const metadata: Metadata = pageMeta({
  title: `Dollar Rate Today in Pakistan: ${usd ? rs(usd.rate) : "USD to PKR"} (${longDate(usd?.date ?? rates.updated.slice(0, 10))})`,
  description: `USD to PKR today: open market buying ${rs(open?.buy)} and selling ${rs(open?.sell)}, interbank ${rs(rates.interbank?.m2m ?? rates.reference?.usd)}. Updated daily from ECAP and the State Bank of Pakistan, with a 30-day chart.`,
  path: "/dollar-rate-today-pakistan",
});

const faq = [
  {
    q: "What is the difference between the open market and the interbank dollar rate?",
    a: "The interbank rate is the rate banks trade at with each other; the State Bank publishes a weighted average of it every working day. The open-market rate is what exchange companies buy and sell dollars at over the counter; ECAP publishes the day's closing average. The open-market rate is usually a rupee or two above interbank.",
  },
  {
    q: "Which rate do I get when I sell dollars in Pakistan?",
    a: "An exchange company pays you its buying rate, which is the lower of the two open-market figures. When you buy dollars you pay the selling rate. Banks use the interbank rate plus their own margin.",
  },
  {
    q: "What time is the dollar rate updated?",
    a: "ECAP collects exchange companies' closing rates between 4 and 4:30 pm and circulates the day's rate by 5 pm. The State Bank publishes its interbank rate on working days. This page reads both in the morning and again in the evening.",
  },
  {
    q: "Why is the rate on this page different from a news site?",
    a: "News sites often quote an intraday rate from one exchange company, or a rate from the previous day. This page shows the official published closing rate with its date, so you can compare like with like.",
  },
];

export default function DollarPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Dollar rate today in Pakistan</h1>
      <Updated date={usd?.date} source={rates.openMarket?.source ?? rates.interbank?.source} url={rates.openMarket?.url ?? rates.interbank?.url} />
      <p className="mt-4 max-w-3xl text-muted">
        USD to PKR open-market buying and selling rates from the Exchange Companies Association of Pakistan, the State
        Bank’s interbank rate, a converter, and how the rate has moved over the last month.
      </p>

      <div className="mt-6">
        <DollarSection />
      </div>

      <section className="prose mt-10">
        <h2>How to read these numbers</h2>
        <p>
          <strong>Buying</strong> is what an exchange company pays you for a dollar; <strong>selling</strong> is what
          you pay to buy one. The gap between them is the company’s margin. The <strong>interbank</strong> rate is the
          State Bank’s mark-to-market figure, a weighted average of the rates at which banks traded that day. Remittances
          sent through banks are usually converted close to the interbank rate; cash at a counter follows the open
          market.
        </p>
        <h2>Sending money from the Gulf or the UK?</h2>
        <p>
          Most remittances are not in dollars. See the <Link href="/aed-to-pkr">dirham</Link>,{" "}
          <Link href="/sar-to-pkr">Saudi riyal</Link> and <Link href="/gbp-to-pkr">pound</Link> pages for the rate in
          those currencies, or the <Link href="/currency-rates-pakistan">full table</Link>.
        </p>
      </section>

      <Faq items={faq} />
      <JsonLd data={breadcrumbData([{ name: "Dollar rate today", path: "/dollar-rate-today-pakistan" }])} />
    </article>
  );
}
