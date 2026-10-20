import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd, pageData } from "@/components/JsonLd";
import { DollarSection } from "@/components/RateSections";
import { ShareRates } from "@/components/ShareRates";
import { Updated } from "@/components/Updated";
import { pageMeta } from "@/lib/meta";
import { changeFrom, longDate, pkrFor, rates, rs } from "@/lib/rates";

const usd = pkrFor("USD");
const open = rates.openMarket?.rates.USD;
const inter = rates.interbank;
const date = longDate(usd?.date ?? rates.updated.slice(0, 10));
const path = "/dollar-rate-today-pakistan";
const change = open
  ? changeFrom(rates.history.openMarket, (row) => (row.USD as { sell: number } | undefined)?.sell)
  : changeFrom(rates.history.interbank, (row) => row.usd);
const movement = change
  ? change.delta === 0
    ? `unchanged from ${longDate(change.since)}`
    : `${change.delta > 0 ? "up" : "down"} ${rs(Math.abs(change.delta))} from ${longDate(change.since)}`
  : "";

const title = `Dollar Rate Today in Pakistan: ${rs(usd?.rate)} Open Market and Interbank (${date})`;
const description = open
  ? `USD to PKR today: open market buying ${rs(open.buy)} and selling ${rs(open.sell)} (ECAP), interbank ${rs(inter?.m2m ?? rates.reference?.usd)} (State Bank). Updated twice a day with a 30-day chart and converter.`
  : `USD to PKR today: ${rs(usd?.rate)} per dollar (${inter ? "State Bank interbank rate" : "central-bank reference rate"}); ECAP's open-market buying and selling rate is added as soon as it is published. Updated twice a day with a 30-day chart and converter.`;

export const metadata: Metadata = pageMeta({ title, description, path });

const lead = open
  ? `As of ${date}, 1 US dollar is ${rs(open.sell)} in Pakistan's open market (exchange companies buy at ${rs(open.buy)} and sell at ${rs(open.sell)}, ECAP closing rate)${inter ? `, and the State Bank interbank rate is ${rs(inter.m2m)}` : ""}${movement ? `; the open-market rate is ${movement}` : ""}.`
  : `As of ${date}, the dollar rate in Pakistan is ${rs(usd?.rate)} per US dollar (${inter ? "State Bank interbank rate" : "central-bank reference rate"})${movement ? `, ${movement}` : ""}. ECAP's open-market buying and selling rate appears here as soon as the day's closing figure is published.`;

const faq = [
  {
    q: "What is the dollar rate in Pakistan today?",
    a: `${rs(usd?.rate)} per US dollar as of ${date}${open ? ` in the open market (buying ${rs(open.buy)}, selling ${rs(open.sell)})` : ""}${inter ? `; the interbank rate is ${rs(inter.m2m)}` : ""}. The figures come from ECAP and the State Bank and are read twice a day.`,
  },
  {
    q: "Aaj dollar ka rate kya hai?",
    a: `Aaj (${date}) 1 dollar ${rs(usd?.rate)} ka hai${open ? `: exchange company ${rs(open.buy)} par kharidti hai aur ${rs(open.sell)} par bechti hai` : ""}. Yeh rate ECAP aur State Bank ki publication se liya gaya hai aur din mein do baar update hota hai.`,
  },
  {
    q: "What is the difference between the open market and the interbank dollar rate?",
    a: "The interbank rate is the rate banks trade at with each other; the State Bank publishes a weighted average of it every working day. The open-market rate is what exchange companies buy and sell dollars at over the counter; ECAP publishes the day's closing average. The open-market rate is usually a rupee or two above interbank.",
  },
  {
    q: "Which rate do I get when I sell dollars in Pakistan?",
    a: "An exchange company pays you its buying rate, which is the lower of the two open-market figures. When you buy dollars you pay the selling rate. Banks use the interbank rate plus their own margin.",
  },
  {
    q: "Is the dollar rate different in Karachi, Lahore and Islamabad?",
    a: "No. ECAP publishes one closing rate for the whole country and the State Bank one interbank rate. A counter in any city may quote a rupee above or below it depending on its own stock of dollars that day, but there is no separate Karachi or Lahore rate.",
  },
  {
    q: "What will the dollar rate be tomorrow?",
    a: "Nobody publishes tomorrow's rate in advance. The rate moves with the demand for dollars (imports, debt payments) against the supply (exports, remittances, State Bank reserves) and with news such as IMF reviews. The 30-day chart on this page shows the direction; day-to-day moves are usually under a rupee.",
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
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Dollar rate today in Pakistan (USD to PKR)</h1>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <Updated
          date={usd?.date}
          source={rates.openMarket?.source ?? rates.interbank?.source}
          url={rates.openMarket?.url ?? rates.interbank?.url}
        />
        <ShareRates kind="dollar" />
      </div>
      <p className="lead mt-4 max-w-3xl text-lg">{lead}</p>
      <p className="mt-3 max-w-3xl text-muted">
        Open-market buying and selling rates from the Exchange Companies Association of Pakistan, the State Bank’s
        interbank rate, a converter, and how the rate has moved over the last month.
      </p>

      <div className="mt-6">
        <DollarSection />
      </div>

      <section className="prose mt-10">
        <h2>Interbank dollar rate today</h2>
        <p>
          {inter
            ? `The State Bank's mark-to-market interbank rate for ${longDate(inter.date)} is ${rs(inter.m2m)} per dollar${inter.bid && inter.offer ? `, with banks bidding ${rs(inter.bid)} and offering ${rs(inter.offer)}` : ""}.`
            : `The State Bank's interbank rate is shown in the third card above when it has been published for the day; until then the card shows the central-bank reference rate of ${rs(rates.reference?.usd)}.`}{" "}
          The interbank rate is what banks use for remittances, letters of credit and card payments abroad, plus their
          own margin. It is published on working days only, so on a Saturday or Sunday the latest Friday figure stands.
        </p>
        <h2>How to read these numbers</h2>
        <p>
          <strong>Buying</strong> is what an exchange company pays you for a dollar; <strong>selling</strong> is what
          you pay to buy one. The gap between them is the company’s margin. The <strong>interbank</strong> rate is the
          State Bank’s mark-to-market figure, a weighted average of the rates at which banks traded that day.
          Remittances sent through banks are usually converted close to the interbank rate; cash at a counter follows
          the open market.
        </p>
        <h2>Why the dollar rate goes up or down</h2>
        <p>
          The rupee price of a dollar is set by how many dollars Pakistan needs against how many come in. Import bills,
          foreign debt repayments and companies sending profits abroad push the rate up; export earnings, remittances
          from Pakistanis abroad, IMF and friendly-country inflows and the State Bank buying or selling from its
          reserves pull it the other way. A gap between the open-market and interbank rates of more than a rupee or two
          usually means cash dollars are scarce at the counters.
        </p>
        <h2>Sending money from the Gulf or the UK?</h2>
        <p>
          Most remittances are not in dollars. See the <Link href="/aed-to-pkr">dirham</Link>,{" "}
          <Link href="/sar-to-pkr">Saudi riyal</Link> and <Link href="/gbp-to-pkr">pound</Link> pages for the rate in
          those currencies, or the <Link href="/currency-rates-pakistan">full table</Link>.
        </p>
      </section>

      <Faq items={faq} />
      <JsonLd data={pageData({ name: title, description, path, dateModified: rates.updated })} />
      <JsonLd data={breadcrumbData([{ name: "Dollar rate today", path }])} />
    </article>
  );
}
