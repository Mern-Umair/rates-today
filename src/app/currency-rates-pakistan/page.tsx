import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd } from "@/components/JsonLd";
import { CurrencyTable } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { pageMeta } from "@/lib/meta";
import { longDate, pkrFor, rates, rs } from "@/lib/rates";

const usd = pkrFor("USD");

export const metadata: Metadata = pageMeta({
  title: `Currency Rates in Pakistan Today: USD, AED, SAR, GBP, EUR to PKR (${longDate(usd?.date ?? rates.updated.slice(0, 10))})`,
  description: `Open-market buying and selling rates in Pakistan today for the dollar (${rs(usd?.rate)}), UAE dirham, Saudi riyal, pound, euro, Qatari riyal, Kuwaiti dinar and more, updated daily from ECAP and the State Bank.`,
  path: "/currency-rates-pakistan",
});

const faq = [
  {
    q: "Which currencies have official open-market rates?",
    a: "ECAP publishes closing buying and selling rates for the US dollar, euro, British pound, Japanese yen, UAE dirham and Saudi riyal. For other currencies this page shows an indicative rate worked out from the dollar rate and the central-bank cross rate, marked with an asterisk.",
  },
  {
    q: "Why is there no buying rate for some currencies?",
    a: "Because no official buying and selling pair is published for them. The indicative figure is a mid rate; an exchange company will buy a little below it and sell a little above it.",
  },
  {
    q: "Which rate should I use to compare remittance services?",
    a: "Compare the rupees you would receive per unit of the currency you are sending with the selling rate here. A service that pays close to or above the open-market selling rate is giving you a good deal.",
  },
];

export default function CurrencyRatesPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Currency rates in Pakistan today</h1>
      <Updated date={usd?.date} source={rates.openMarket?.source ?? rates.otherCurrencies?.source} url={rates.openMarket?.url} />
      <p className="mt-4 max-w-3xl text-muted">
        Rupees per unit of each currency, with ECAP’s open-market buying and selling rates where they are published and
        an indicative rate everywhere else. Tap a currency for its own page with a converter and chart.
      </p>
      <div className="mt-6">
        <CurrencyTable />
      </div>
      <Faq items={faq} />
      <JsonLd data={breadcrumbData([{ name: "Currency rates", path: "/currency-rates-pakistan" }])} />
    </article>
  );
}
