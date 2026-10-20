import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd, pageData } from "@/components/JsonLd";
import { CurrencyTable } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { pageMeta } from "@/lib/meta";
import { longDate, pkrFor, rates, rs } from "@/lib/rates";

const usd = pkrFor("USD");
const aed = pkrFor("AED");
const sar = pkrFor("SAR");
const gbp = pkrFor("GBP");
const date = longDate(usd?.date ?? rates.updated.slice(0, 10));
const path = "/currency-rates-pakistan";

const title = `Currency Rates in Pakistan Today: Open Market Forex Rates (${date})`;
const description = `Open-market buying and selling rates in Pakistan today for the dollar (${rs(usd?.rate)}), UAE dirham (${rs(aed?.rate)}), Saudi riyal (${rs(sar?.rate)}), pound (${rs(gbp?.rate)}), euro, Qatari riyal, Kuwaiti dinar and more, updated twice a day from ECAP and the State Bank.`;

export const metadata: Metadata = pageMeta({ title, description, path });

const lead = `As of ${date}, 1 US dollar is ${rs(usd?.rate)}, 1 UAE dirham ${rs(aed?.rate)}, 1 Saudi riyal ${rs(sar?.rate)} and 1 British pound ${rs(gbp?.rate)} in Pakistan; the table below has all 15 currencies with buying and selling where ECAP publishes them.`;

const faq = [
  {
    q: "What are the currency rates in Pakistan today?",
    a: `As of ${date}: US dollar ${rs(usd?.rate)}, UAE dirham ${rs(aed?.rate)}, Saudi riyal ${rs(sar?.rate)}, British pound ${rs(gbp?.rate)}. The table on this page lists 15 currencies with ECAP's open-market buying and selling rates where they are published.`,
  },
  {
    q: "Which currencies have official open-market rates?",
    a: "ECAP publishes closing buying and selling rates for the US dollar, euro, British pound, Japanese yen, UAE dirham and Saudi riyal. For other currencies this page shows an indicative rate worked out from the dollar rate and the central-bank cross rate, marked with an asterisk.",
  },
  {
    q: "What is the difference between open market, interbank and bank rates?",
    a: "The open-market rate is what licensed exchange companies quote over the counter for cash. The interbank rate is the rate banks trade at with each other, published by the State Bank. A bank's own counter or card rate is the interbank rate plus the bank's margin. For cash, compare with the open market; for a bank transfer or card payment, with interbank.",
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
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Currency rates in Pakistan today: open market forex rates
      </h1>
      <Updated
        date={usd?.date}
        source={rates.openMarket?.source ?? rates.otherCurrencies?.source}
        url={rates.openMarket?.url}
      />
      <p className="lead mt-4 max-w-3xl text-lg">{lead}</p>
      <p className="mt-3 max-w-3xl text-muted">
        Rupees per unit of each currency, with ECAP’s open-market buying and selling rates where they are published and
        an indicative rate everywhere else. Tap a currency for its own page with a converter and chart, or see the{" "}
        <Link href="/dollar-rate-today-pakistan" className="underline underline-offset-2">
          dollar page
        </Link>{" "}
        for the interbank rate.
      </p>
      <div className="mt-6">
        <CurrencyTable />
      </div>
      <Faq items={faq} />
      <JsonLd data={pageData({ name: title, description, path, dateModified: rates.updated })} />
      <JsonLd data={breadcrumbData([{ name: "Currency rates", path }])} />
    </article>
  );
}
