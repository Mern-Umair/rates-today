import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd, pageData } from "@/components/JsonLd";
import { FuelSection } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { cities } from "@/data/pages";
import { pageMeta } from "@/lib/meta";
import { changeFrom, longDate, rates, rs } from "@/lib/rates";

const fuel = rates.fuel;
const date = longDate(fuel?.date ?? rates.updated.slice(0, 10));
const path = "/petrol-price-today-pakistan";
const change = changeFrom(rates.history.fuel, (row) => row.petrol);
const movement = change
  ? change.delta === 0
    ? `unchanged from ${longDate(change.since)}`
    : `${change.delta > 0 ? "up" : "down"} ${rs(Math.abs(change.delta))} from ${longDate(change.since)}`
  : "";
const previous =
  rates.history.fuel && rates.history.fuel.length >= 2 ? rates.history.fuel[rates.history.fuel.length - 2] : null;
const cityList = `${cities.slice(0, -1).join(", ")} and ${cities[cities.length - 1]}`;

const title = `Petrol Price Today in Pakistan: ${rs(fuel?.petrol)}, Diesel ${rs(fuel?.diesel)} per Litre (${date})`;
const description = `Today's petrol price in Pakistan is ${rs(fuel?.petrol)} per litre and high-speed diesel ${rs(fuel?.diesel)}, effective ${date}, from OGRA's daily price publication. Same price in Karachi, Lahore and Islamabad. Updated every day with a 30-day chart.`;

export const metadata: Metadata = pageMeta({ title, description, path });

const lead = fuel
  ? `As of ${date}, petrol is ${rs(fuel.petrol)} per litre and high-speed diesel ${rs(fuel.diesel)} per litre in Pakistan, the OGRA price in force from midnight${movement ? `; petrol is ${movement}` : ""}.`
  : `The petrol price for ${date} has not been read yet; it appears here as soon as OGRA publishes it.`;

const faq = [
  {
    q: "What is the petrol price in Pakistan today?",
    a: fuel
      ? `${rs(fuel.petrol)} per litre for petrol and ${rs(fuel.diesel)} per litre for high-speed diesel, effective ${date}, as published by OGRA. The price is the same at every pump in the country apart from small local freight differences.`
      : "The figure appears at the top of this page as soon as OGRA publishes the day's price.",
  },
  {
    q: "Aaj petrol ki qeemat kya hai?",
    a: fuel
      ? `Aaj (${date}) petrol ${rs(fuel.petrol)} fi litre aur diesel ${rs(fuel.diesel)} fi litre hai. Yeh OGRA ki roz ki publication se liya gaya rate hai aur poore mulk mein ek hi hai.`
      : "Aaj ka rate OGRA ki publication ke baad yahan aa jayega.",
  },
  {
    q: "What was the petrol price yesterday?",
    a: previous
      ? `${rs(previous.petrol)} per litre on ${longDate(previous.date)}${previous.diesel ? ` (diesel ${rs(previous.diesel)})` : ""}, so today's price is ${movement || "the same"}.`
      : "The previous day's price appears here once two days of figures have been read; the chart below fills in the same way.",
  },
  {
    q: "What will the petrol price be tomorrow?",
    a: "OGRA does not announce the next day's price in advance; it publishes each day's price build-up on its site and the price takes effect at midnight. Because each day's price is a seven-working-day average of international prices, it moves by a rupee or two a day rather than in jumps, so the direction of the last few days on the chart is the best guide.",
  },
  {
    q: "Why does the petrol price change every day now?",
    a: "From July 2026 OGRA moved from fortnightly to daily revision. Each day's price is built from a seven-working-day rolling average of the international (Platts Arab Gulf) price, the State Bank's average exchange rate, freight, duties, the petroleum levy and margins, and takes effect at midnight.",
  },
  {
    q: "What is in the price of a litre of petrol?",
    a: `For ${date} OGRA's publication shows the imported cost, customs duty, the inland freight margin, the oil company and dealer margins, a petroleum levy of Rs 80 and a climate support levy of Rs 5 per litre. Petrol is currently exempt from sales tax. The full build-up is in the OGRA document linked above.`,
  },
  {
    q: "Is this the price at every pump?",
    a: "OGRA's figure excludes secondary freight, the cost of moving fuel from the depot to each pump, so prices can differ by a rupee or so between cities. Discounts under the Petrol Relief Scheme for motorcycle and rickshaw owners are applied separately.",
  },
  {
    q: "Where does the diesel price come from?",
    a: "The same OGRA publication, which has a second page for high-speed diesel with its own international reference price and crack spread.",
  },
];

export default function PetrolPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Petrol and diesel price today in Pakistan</h1>
      <Updated date={fuel?.date} source={fuel?.source} url={fuel?.url} />
      <p className="lead mt-4 max-w-3xl text-lg">{lead}</p>
      <p className="mt-3 max-w-3xl text-muted">
        The price of petrol and high-speed diesel per litre as published by the Oil and Gas Regulatory Authority (OGRA),
        effective from midnight, with the change against the previous day and a chart of the last month.
      </p>

      <div className="mt-6">
        <FuelSection />
      </div>

      <section className="prose mt-10">
        <h2>Petrol price in Karachi, Lahore, Islamabad and every other city</h2>
        <p>
          {fuel
            ? `Petrol is ${rs(fuel.petrol)} per litre today in ${cityList}.`
            : `Petrol is the same price in ${cityList}.`}{" "}
          There is one OGRA price for the whole country: the inland freight equalisation margin in the price build-up
          spreads the cost of moving fuel from the ports and refineries so that a litre costs the same in Peshawar as in
          Karachi. Only the secondary freight from the local depot to the pump can add a rupee or so in a few far-off
          districts.
        </p>
        <h2>How OGRA sets the daily price</h2>
        <p>
          OGRA publishes a price build-up every day. It starts from the seven-working-day average of the Platts Arab
          Gulf price for petrol, adds freight and the premium paid on imports, converts to rupees at the State Bank’s
          average exchange rate, and then adds customs duty, the inland freight equalisation margin, the oil marketing
          company and dealer margins, the petroleum levy and the climate support levy. The full impact of a change in
          the international price is passed on over seven working days, so the price moves a little every day rather
          than in big steps.
        </p>
        <h2>LPG</h2>
        <p>
          LPG is priced once a month, not daily. See the <Link href="/lpg-price-today-pakistan">LPG price</Link> page
          for this month’s per-kg and cylinder price.
        </p>
      </section>

      <Faq items={faq} />
      <JsonLd data={pageData({ name: title, description, path, dateModified: rates.updated })} />
      <JsonLd data={breadcrumbData([{ name: "Petrol price today", path }])} />
    </article>
  );
}
