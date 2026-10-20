import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd, pageData } from "@/components/JsonLd";
import { CurrencySection } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { currencyPage, currencyPages } from "@/data/pages";
import { pageMeta } from "@/lib/meta";
import { changeFrom, longDate, pkrFor, rates, rs } from "@/lib/rates";

export const dynamicParams = false;

export function generateStaticParams() {
  return currencyPages.map((page) => ({ slug: page.slug }));
}

function titleFor(page: NonNullable<ReturnType<typeof currencyPage>>) {
  const rate = pkrFor(page.code);
  return `${page.code} to PKR Today: 1 ${page.name} = ${rs(rate?.rate)} in Pakistan (${longDate(rate?.date ?? rates.updated.slice(0, 10))})`;
}

function descriptionFor(page: NonNullable<ReturnType<typeof currencyPage>>) {
  const rate = pkrFor(page.code);
  const open = rates.openMarket?.rates[page.code];
  return `${page.name} to Pakistani rupee rate today: 1 ${page.code} = ${rs(rate?.rate)}. ${open ? `Open-market buying ${rs(open.buy)} and selling ${rs(open.sell)} from ECAP` : "Indicative rate from the dollar rate and central-bank cross rates"}, a converter, a ready-reckoner table and a chart. Updated twice a day.`;
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = currencyPage(slug);
  if (!page) return {};
  return pageMeta({ title: titleFor(page), description: descriptionFor(page), path: `/${page.slug}` });
}

const gulf = ["AED", "SAR", "QAR", "KWD", "OMR", "BHD"];
const remittanceApps: Record<string, string> = {
  SAR: "Al Rajhi Bank, Barq, STC Pay, Western Union and Remitly",
  AED: "Al Ansari, Lulu Exchange, Western Union, Remitly and bank apps",
  GBP: "Remitly, TapTap Send, Wise, Western Union and bank transfers",
  QAR: "Qatar's exchange houses, Western Union and Remitly",
  KWD: "Kuwait's exchange companies, Western Union and Remitly",
  OMR: "Oman's exchange houses, Western Union and Remitly",
  BHD: "Bahrain's exchange houses, Western Union and Remitly",
  USD: "Remitly, Wise, Western Union, Xoom and bank transfers",
  EUR: "Remitly, Wise, Western Union and bank transfers",
  CAD: "Remitly, Wise, Western Union and bank transfers",
  AUD: "Remitly, Wise, Western Union and bank transfers",
};

export default async function CurrencyPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = currencyPage(slug);
  if (!page) notFound();
  const rate = pkrFor(page.code);
  const open = rates.openMarket?.rates[page.code];
  const isGulf = gulf.includes(page.code);
  const path = `/${page.slug}`;
  const date = longDate(rate?.date ?? rates.updated.slice(0, 10));
  const change = open
    ? changeFrom(rates.history.openMarket, (row) => (row[page.code] as { sell: number } | undefined)?.sell)
    : null;
  const movement = change
    ? change.delta === 0
      ? `unchanged from ${longDate(change.since)}`
      : `${change.delta > 0 ? "up" : "down"} ${rs(Math.abs(change.delta))} from ${longDate(change.since)}`
    : "";
  const apps = remittanceApps[page.code];

  const lead = rate
    ? `As of ${date}, 1 ${page.name} (${page.code}) is ${rs(rate.rate)} in Pakistan${open ? `: exchange companies buy at ${rs(open.buy)} and sell at ${rs(open.sell)} (ECAP open-market closing rate)` : ", an indicative rate from the dollar rate and the central-bank cross rate"}${movement ? `; the rate is ${movement}` : ""}.`
    : `The ${page.code} rate for ${date} has not been published yet; it appears here as soon as the day's figures are read.`;

  const faq = [
    {
      q: `What is 1 ${page.code} in Pakistani rupees today?`,
      a: rate
        ? `1 ${page.name} is ${rs(rate.rate)} as of ${date}. ${open ? `Exchange companies buy at ${rs(open.buy)} and sell at ${rs(open.sell)}.` : "This is an indicative mid rate; a counter buys a little below and sells a little above it."}`
        : `The ${page.code} rate has not been published yet today. It appears on this page as soon as the day's figures are read.`,
    },
    {
      q: `How much is 1,000 ${page.code} in PKR?`,
      a: rate
        ? `${rs(rate.rate * 1000, 0)} at today's rate. The table on this page gives other amounts, and the converter works for any figure.`
        : "Multiply the rate at the top of this page by 1,000; the converter does it for any amount once the rate is in.",
    },
    isGulf
      ? {
          q: `Which rate applies when I send money from ${page.country} to Pakistan?`,
          a: "Remittance services quote their own rate, usually close to the open-market selling rate. Compare the rupees per unit they offer with the rate on this page; banks and licensed exchange houses that pay through the official channel often match or beat it because of the State Bank's remittance incentives.",
        }
      : {
          q: `Where does the ${page.code} rate come from?`,
          a: open
            ? "The Exchange Companies Association of Pakistan (ECAP) publishes the day's closing buying and selling rates through the State Bank of Pakistan."
            : "ECAP does not publish an open-market rate for this currency, so the rate is worked out from the day's dollar rate and the central-bank cross rate, and marked as indicative.",
        },
    ...(apps
      ? [
          {
            q: `Why is the ${page.code} to PKR rate on ${apps.split(",")[0]} different from this page?`,
            a: `${apps} each quote their own rate, usually a little below the open-market rate here; the difference, plus any fee, is their margin. Compare the rupees you will receive per ${page.unit} with today's selling rate on this page, and check the fee separately, since a "zero fee" service often takes a wider margin on the rate instead.`,
          },
        ]
      : []),
    {
      q: `Will the ${page.code} rate go up or down tomorrow?`,
      a: `Nobody publishes tomorrow's rate in advance. The ${page.code} rate in rupees follows the dollar rate in Pakistan and the ${page.code} to dollar rate on world markets. The chart on this page shows the last 30 days; day-to-day moves are usually small, so if you are sending money, the fee and the margin matter more than waiting a day.`,
    },
  ];

  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {page.code} to PKR today: {page.name} rate in Pakistan
      </h1>
      <Updated
        date={rate?.date}
        source={open ? rates.openMarket?.source : rates.otherCurrencies?.source}
        url={open ? rates.openMarket?.url : undefined}
      />
      <p className="lead mt-4 max-w-3xl text-lg">{lead}</p>
      <p className="mt-3 max-w-3xl text-muted">
        Today’s {page.name} ({page.code}) rate in Pakistani rupees
        {isGulf ? `, for people in ${page.country} sending money home` : ""}, with a converter, a ready-reckoner table
        and a chart.
      </p>
      <div className="mt-6">
        <CurrencySection code={page.code} unit={page.unit} />
      </div>
      <section className="prose mt-10">
        <h2>Other currencies</h2>
        <p>
          <Link href="/dollar-rate-today-pakistan">US dollar</Link>
          {currencyPages
            .filter((other) => other.code !== page.code && other.code !== "USD")
            .slice(0, 8)
            .map((other) => (
              <span key={other.slug}>
                {" · "}
                <Link href={`/${other.slug}`}>{other.code}</Link>
              </span>
            ))}
          {" · "}
          <Link href="/currency-rates-pakistan">all currencies</Link>
        </p>
      </section>
      <Faq items={faq} />
      <JsonLd
        data={pageData({ name: titleFor(page), description: descriptionFor(page), path, dateModified: rates.updated })}
      />
      <JsonLd data={breadcrumbData([{ name: `${page.code} to PKR`, path }])} />
    </article>
  );
}
