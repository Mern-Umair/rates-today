import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd } from "@/components/JsonLd";
import { FuelSection } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { pageMeta } from "@/lib/meta";
import { longDate, rates, rs } from "@/lib/rates";

const fuel = rates.fuel;

export const metadata: Metadata = pageMeta({
  title: `Petrol Price Today in Pakistan: ${rs(fuel?.petrol)} per Litre (${longDate(fuel?.date)})`,
  description: `Today's petrol price in Pakistan is ${rs(fuel?.petrol)} per litre and diesel ${rs(fuel?.diesel)}, effective ${longDate(fuel?.date)}, from OGRA's daily price publication. Updated every day with a 30-day chart.`,
  path: "/petrol-price-today-pakistan",
});

const faq = [
  {
    q: "Why does the petrol price change every day now?",
    a: "From July 2026 OGRA moved from fortnightly to daily revision. Each day's price is built from a seven-working-day rolling average of the international (Platts Arab Gulf) price, the State Bank's average exchange rate, freight, duties, the petroleum levy and margins, and takes effect at midnight.",
  },
  {
    q: "What is in the price of a litre of petrol?",
    a: `For ${longDate(fuel?.date)} OGRA's publication shows the imported cost, customs duty, the inland freight margin, the oil company and dealer margins, a petroleum levy of Rs 80 and a climate support levy of Rs 5 per litre. Petrol is currently exempt from sales tax. The full build-up is in the OGRA document linked above.`,
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
      <p className="mt-4 max-w-3xl text-muted">
        The price of petrol and high-speed diesel per litre as published by the Oil and Gas Regulatory Authority
        (OGRA), effective from midnight, with the change against the previous day and a chart of the last month.
      </p>

      <div className="mt-6">
        <FuelSection />
      </div>

      <section className="prose mt-10">
        <h2>How OGRA sets the daily price</h2>
        <p>
          OGRA publishes a price build-up every day. It starts from the seven-working-day average of the Platts Arab
          Gulf price for petrol, adds freight and the premium paid on imports, converts to rupees at the State Bank’s
          average exchange rate, and then adds customs duty, the inland freight equalisation margin, the oil marketing
          company and dealer margins, the petroleum levy and the climate support levy. The full impact of a change in
          the international price is passed on over seven working days, so the price moves a little every day rather
          than in big steps.
        </p>
      </section>

      <Faq items={faq} />
      <JsonLd data={breadcrumbData([{ name: "Petrol price today", path: "/petrol-price-today-pakistan" }])} />
    </article>
  );
}
