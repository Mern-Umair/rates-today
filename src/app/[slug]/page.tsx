import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd } from "@/components/JsonLd";
import { CurrencySection } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { currencyPage, currencyPages } from "@/data/pages";
import { pageMeta } from "@/lib/meta";
import { longDate, pkrFor, rates, rs } from "@/lib/rates";

export const dynamicParams = false;

export function generateStaticParams() {
  return currencyPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = currencyPage(slug);
  if (!page) return {};
  const rate = pkrFor(page.code);
  return pageMeta({
    title: `${page.code} to PKR Today: 1 ${page.name} = ${rs(rate?.rate)} (${longDate(rate?.date ?? rates.updated.slice(0, 10))})`,
    description: `${page.name} to Pakistani rupee rate today: 1 ${page.code} = ${rs(rate?.rate)}. ${rates.openMarket?.rates[page.code] ? "Open-market buying and selling rates from ECAP" : "Indicative rate from the dollar rate and central-bank cross rates"}, a converter, a ready-reckoner table and a chart. Updated daily.`,
    path: `/${page.slug}`,
  });
}

const gulf = ["AED", "SAR", "QAR", "KWD", "OMR", "BHD"];

export default async function CurrencyPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = currencyPage(slug);
  if (!page) notFound();
  const rate = pkrFor(page.code);
  const open = rates.openMarket?.rates[page.code];
  const isGulf = gulf.includes(page.code);

  const faq = [
    {
      q: `What is 1 ${page.code} in Pakistani rupees today?`,
      a: rate
        ? `1 ${page.name} is ${rs(rate.rate)} as of ${longDate(rate.date)}. ${open ? `Exchange companies buy at ${rs(open.buy)} and sell at ${rs(open.sell)}.` : "This is an indicative mid rate; a counter buys a little below and sells a little above it."}`
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
  ];

  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {page.code} to PKR today: {page.name} rate in Pakistan
      </h1>
      <Updated date={rate?.date} source={open ? rates.openMarket?.source : rates.otherCurrencies?.source} url={open ? rates.openMarket?.url : undefined} />
      <p className="mt-4 max-w-3xl text-muted">
        Today’s {page.name} ({page.code}) rate in Pakistani rupees{isGulf ? `, for people in ${page.country} sending money home` : ""}, with a converter, a ready-reckoner table and a chart.
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
      <JsonLd data={breadcrumbData([{ name: `${page.code} to PKR`, path: `/${page.slug}` }])} />
    </article>
  );
}
