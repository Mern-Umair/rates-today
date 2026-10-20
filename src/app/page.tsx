import Link from "next/link";
import { Faq } from "@/components/Faq";
import { JsonLd, pageData, siteData } from "@/components/JsonLd";
import { CurrencyTable, HomeCards } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { ratePages } from "@/data/pages";
import { siteName } from "@/data/site";
import { longDate, pkrFor, rates, rs } from "@/lib/rates";

const usd = pkrFor("USD");
const aed = pkrFor("AED");
const sar = pkrFor("SAR");
const today = longDate(usd?.date ?? rates.updated.slice(0, 10));

const lead = `Today, ${today}: the dollar is ${rs(usd?.rate)}, 24k gold ${rs(rates.gold?.tola24k)} per tola, petrol ${rs(rates.fuel?.petrol)} per litre, the UAE dirham ${rs(aed?.rate)} and the Saudi riyal ${rs(sar?.rate)}.`;

const faq = [
  {
    q: "What is the dollar rate in Pakistan today?",
    a: `${usd ? `${rs(usd.rate)} per US dollar` : "See the dollar page"} as of ${usd ? longDate(usd.date) : today}. The open-market rate comes from the Exchange Companies Association of Pakistan (ECAP) and the interbank rate from the State Bank of Pakistan. The two differ by a rupee or two; exchange counters use the open-market rate.`,
  },
  {
    q: "Aaj dollar ka rate kya hai?",
    a: `Aaj (${today}) 1 dollar ${rs(usd?.rate)} ka hai. Yeh ECAP aur State Bank ki publication se liya gaya rate hai, din mein do baar update hota hai.`,
  },
  {
    q: "What is the gold rate today per tola?",
    a: `24 karat gold is ${rs(rates.gold?.tola24k)} per tola and 22 karat is ${rs(rates.gold?.tola22k)} per tola. The figure is the world gold price converted at today's dollar rate; a jeweller adds making charges on top.`,
  },
  {
    q: "Aaj sone ka rate kya hai?",
    a: `Aaj 24 karat sona ${rs(rates.gold?.tola24k)} fi tola aur 22 karat ${rs(rates.gold?.tola22k)} fi tola hai. Lahore, Karachi aur Islamabad mein rate taqreeban yahi hota hai; sunaar banwai alag lagata hai.`,
  },
  {
    q: "What is the petrol price in Pakistan today?",
    a: `Petrol is ${rs(rates.fuel?.petrol)} per litre and diesel ${rs(rates.fuel?.diesel)} per litre, effective ${longDate(rates.fuel?.date)}, as published by OGRA. Since July 2026 OGRA revises the price every day from a seven-day average of international prices.`,
  },
  {
    q: "Aaj petrol ki qeemat kya hai?",
    a: `Aaj petrol ${rs(rates.fuel?.petrol)} fi litre aur diesel ${rs(rates.fuel?.diesel)} fi litre hai, OGRA ke mutabiq, poore Pakistan mein ek hi qeemat.`,
  },
  {
    q: "How often are these rates updated?",
    a: "Twice a day, every day. The State Bank, ECAP and OGRA figures are read from their own publications each morning and evening, and the gold figure follows the world price at the same times. LPG follows OGRA's monthly notification.",
  },
  {
    q: "Are these the rates I will get at an exchange company or a jeweller?",
    a: "They are the published reference rates. A counter can quote a little above or below, and a jeweller adds making charges and may use the Sarafa association rate of the day. Use these figures to know what a fair price is.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-hero text-hero-fg">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Dollar, gold and petrol rates in Pakistan today
          </h1>
          <p className="lead mt-3 max-w-2xl text-lg text-hero-fg">{lead}</p>
          <p className="mt-3 max-w-2xl text-hero-muted">
            Every rate people look up each day, in one place: the open-market and interbank dollar rate, gold and silver
            per tola, petrol, diesel and LPG, and dirham, riyal and pound to rupee. Taken each day from the State Bank,
            ECAP and OGRA publications and the world gold price, nothing typed by hand.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <section className="-mt-6" aria-labelledby="today">
          <h2 id="today" className="sr-only">
            Today’s rates
          </h2>
          <HomeCards />
          <Updated />
        </section>

        <section className="mt-12" aria-labelledby="gulf">
          <h2 id="gulf" className="text-2xl font-semibold tracking-tight">
            Gulf, UK and other currencies to PKR
          </h2>
          <p className="mt-2 text-muted">
            Rupees per unit of each currency. For people sending money home from the UAE, Saudi Arabia, Qatar, Kuwait,
            Oman, Bahrain or the UK, the selling rate is the one to compare with your exchange house.
          </p>
          <div className="mt-4">
            <CurrencyTable limit={9} />
          </div>
          <p className="mt-3">
            <Link href="/currency-rates-pakistan" className="font-medium text-accent underline underline-offset-2">
              All currency rates
            </Link>
          </p>
        </section>

        <section className="mt-12" aria-labelledby="pages">
          <h2 id="pages" className="text-2xl font-semibold tracking-tight">
            Rate pages
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ratePages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="block rounded-xl border border-line bg-surface p-4 font-medium transition-colors hover:border-accent"
                >
                  {page.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="prose mt-12" aria-labelledby="sources">
          <h2 id="sources" className="text-2xl font-semibold tracking-tight">
            Where every number comes from
          </h2>
          <p>
            Most “rate today” pages copy each other or type the numbers in by hand, which is why they disagree and go
            stale. {siteName} reads the official publications directly, twice a day:
          </p>
          <ul>
            <li>
              <strong>Dollar and other currencies:</strong> the open-market closing rates that the Exchange Companies
              Association of Pakistan (ECAP) publishes through the State Bank, and the State Bank’s own interbank
              mark-to-market rate. Currencies ECAP does not list are worked out from the dollar rate and central-bank
              cross rates, and marked as indicative.
            </li>
            <li>
              <strong>Gold and silver:</strong> the world spot price per troy ounce, converted at the day’s dollar rate
              into rupees per tola (11.6638 grams), per 10 grams and per gram, for 24, 22, 21 and 18 karat.
            </li>
            <li>
              <strong>Petrol, diesel and LPG:</strong> OGRA’s daily price publication, which since July 2026 sets the
              petrol and diesel price every day from a seven-day average of international prices and the exchange rate,
              and OGRA’s monthly LPG consumer price notification.
            </li>
          </ul>
          <p>
            Each figure shows the date it was published, so you always know how old it is. Read more on the{" "}
            <Link href="/about">about and sources</Link> page.
          </p>
        </section>

        <Faq items={faq} />
      </div>
      <JsonLd data={siteData} />
      <JsonLd
        data={pageData({
          name: "Dollar, gold and petrol rates in Pakistan today",
          description: lead,
          path: "",
          dateModified: rates.updated,
        })}
      />
    </>
  );
}
