import type { Metadata } from "next";
import { TextPage } from "@/components/TextPage";
import { owner, siteName } from "@/data/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "About and sources",
  description: `Who runs ${siteName}, where each rate comes from (State Bank, ECAP, OGRA, world gold price), how often it updates and what it does not do.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <TextPage title="About and sources" updated="20 October 2026">
      <p>
        {siteName} shows the rates people in Pakistan, and Pakistanis abroad, look up every day: the dollar and other
        currencies, gold, and petrol. It exists because most pages that promise “today’s rate” are typed by hand, copied
        from each other, or quietly out of date. Here every number is read from the organisation that publishes it,
        twice a day, and shown with its date.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>
          <strong>Open-market currency rates:</strong> the Exchange Companies Association of Pakistan (ECAP) publishes
          closing buying and selling rates for the US dollar, euro, pound, yen, UAE dirham and Saudi riyal, circulated
          through the State Bank of Pakistan each working day.
        </li>
        <li>
          <strong>Interbank dollar rate:</strong> the State Bank of Pakistan’s mark-to-market revaluation rate and
          weighted average bid and offer, from sbp.org.pk.
        </li>
        <li>
          <strong>Other currencies:</strong> worked out from the dollar rate and central-bank reference cross rates
          (through the open Frankfurter service). These are marked as indicative because no Pakistani body publishes an
          open-market rate for them.
        </li>
        <li>
          <strong>Gold and silver:</strong> the world spot price in US dollars per troy ounce, converted at the day’s
          dollar rate into rupees per tola, per 10 grams and per gram, for 24, 22, 21 and 18 karat. The Sarafa
          associations’ announced rates follow the same arithmetic and usually sit within one percent.
        </li>
        <li>
          <strong>Petrol and diesel:</strong> the Oil and Gas Regulatory Authority (OGRA) daily price publication, which
          sets each day’s price from a seven-day average of international prices, the exchange rate, duties and levies.
        </li>
      </ul>

      <h2>What this site does not do</h2>
      <ul>
        <li>It does not buy, sell or exchange anything, and takes no payments.</li>
        <li>It does not give financial advice. A published rate is a reference; the rate at a counter can differ.</li>
        <li>
          It is independent: not run by or connected with the State Bank, ECAP, OGRA, any exchange company or any
          jeweller.
        </li>
      </ul>

      <h2>Who runs it</h2>
      <p>
        {siteName} is built and maintained by {owner.name}, a web developer in {owner.city}, who also runs{" "}
        <a href="https://formkb.com">FormKB</a>, a set of free photo and document tools for online application forms.
        Questions and corrections: {owner.email}.
      </p>
    </TextPage>
  );
}
