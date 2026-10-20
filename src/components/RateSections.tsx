"use client";

// The number-carrying parts of each page. They read the live rates (built-in first,
// then refreshed from /data/rates.json) so the figures are never older than the file.
import { Converter } from "@/components/Converter";
import { HistoryChart } from "@/components/HistoryChart";
import { Change, RateCard } from "@/components/RateCard";
import { useRates } from "@/components/RatesProvider";
import { cities, currencyPages } from "@/data/pages";
import { changeFrom, GRAMS_PER_TOLA, longDate, pkrFor, rs, type Rates } from "@/lib/rates";

function usdDelta(rates: Rates) {
  const open = changeFrom(rates.history.openMarket, (row) => (row.USD as { sell: number } | undefined)?.sell);
  if (open) return open.delta;
  return changeFrom(rates.history.interbank, (row) => row.usd)?.delta ?? null;
}

function usdLabel(rates: Rates) {
  if (rates.openMarket?.rates.USD) return "Open market selling";
  if (rates.interbank) return "SBP interbank rate";
  return "Reference rate";
}

/** The four headline cards on the home page. */
export function HomeCards() {
  const rates = useRates();
  const usd = pkrFor("USD", rates);
  const aed = pkrFor("AED", rates);
  const petrolDelta = changeFrom(rates.history.fuel, (row) => row.petrol)?.delta ?? null;
  const goldDelta = changeFrom(rates.history.gold, (row) => row.tola24k)?.delta ?? null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <RateCard
        label="Dollar rate (USD to PKR)"
        value={rs(usd?.rate)}
        sub={usdLabel(rates)}
        delta={usdDelta(rates)}
        href="/dollar-rate-today-pakistan"
      />
      <RateCard
        label="Gold rate, 24k per tola"
        value={rs(rates.gold?.tola24k)}
        sub={`10 grams ${rs(rates.gold?.tenGram24k)}`}
        delta={goldDelta}
        href="/gold-rate-today-pakistan"
      />
      <RateCard
        label="Petrol price per litre"
        value={rs(rates.fuel?.petrol)}
        sub={rates.fuel?.diesel ? `Diesel ${rs(rates.fuel.diesel)}` : undefined}
        delta={petrolDelta}
        href="/petrol-price-today-pakistan"
      />
      <RateCard
        label="UAE dirham (AED to PKR)"
        value={rs(aed?.rate)}
        sub={aed?.kind === "open-market" ? "Open market selling" : "Indicative rate"}
        href="/aed-to-pkr"
      />
    </div>
  );
}

/** Every currency the site covers, rupees per unit, with buying and selling where published. */
export function CurrencyTable({ limit }: { limit?: number }) {
  const rates = useRates();
  const rows = currencyPages.slice(0, limit ?? currencyPages.length);
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full text-left text-sm sm:text-base">
        <thead className="bg-surface-2 text-sm text-muted">
          <tr>
            <th className="px-4 py-2.5 font-medium">Currency</th>
            <th className="px-4 py-2.5 text-right font-medium">Buying</th>
            <th className="px-4 py-2.5 text-right font-medium">Selling</th>
            <th className="px-4 py-2.5 text-right font-medium">As of</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((page) => {
            const open = rates.openMarket?.rates[page.code];
            const any = pkrFor(page.code, rates);
            return (
              <tr key={page.code}>
                <td className="px-4 py-2.5">
                  <a href={`/${page.slug}`} className="font-medium hover:underline">
                    {page.code}
                  </a>{" "}
                  <span className="text-muted">{page.name}</span>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">{open ? rs(open.buy) : "—"}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {open ? rs(open.sell) : any ? `${rs(any.rate)}*` : "—"}
                </td>
                <td className="px-4 py-2.5 text-right text-sm text-muted">{any ? longDate(any.date) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="px-4 py-3 text-xs text-muted">
        Buying and selling are ECAP open-market closing rates. * Indicative rate: the central-bank cross rate applied to
        the dollar rate, where ECAP does not publish that currency.
      </p>
    </div>
  );
}

/** Dollar page: open market, interbank, chart and converter. */
export function DollarSection() {
  const rates = useRates();
  const open = rates.openMarket?.rates.USD;
  const inter = rates.interbank;
  const usd = pkrFor("USD", rates);
  const history = (rates.history.openMarket ?? [])
    .map((row) => ({ date: row.date, value: (row.USD as { sell: number } | undefined)?.sell ?? NaN }))
    .filter((row) => Number.isFinite(row.value));
  const interHistory = (rates.history.interbank ?? []).map((row) => ({ date: row.date, value: row.usd }));
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <RateCard
          label="Open market buying"
          value={rs(open?.buy)}
          sub={open ? `ECAP, ${longDate(rates.openMarket?.date)}` : "Not published yet today"}
        />
        <RateCard
          label="Open market selling"
          value={rs(open?.sell)}
          sub={open ? `ECAP, ${longDate(rates.openMarket?.date)}` : "Not published yet today"}
          delta={usdDelta(rates)}
        />
        <RateCard
          label="Interbank (SBP)"
          value={rs(inter?.m2m ?? rates.reference?.usd)}
          sub={
            inter
              ? `Bid ${rs(inter.bid)} · Offer ${rs(inter.offer)}`
              : rates.reference
                ? "Central-bank reference"
                : undefined
          }
          note={
            inter
              ? `Mark-to-market rate, ${longDate(inter.date)}`
              : rates.reference
                ? longDate(rates.reference.date)
                : undefined
          }
        />
      </div>
      {usd && <Converter code="USD" unit="dollar" rate={usd.rate} />}
      <HistoryChart
        points={history.length >= 2 ? history : interHistory}
        label={history.length >= 2 ? "Open market selling rate" : "SBP interbank rate"}
        format={(value) => `Rs ${value.toFixed(2)}`}
      />
    </div>
  );
}

/** Gold page: every purity and weight, silver, chart. */
export function GoldSection() {
  const rates = useRates();
  const gold = rates.gold;
  const delta = changeFrom(rates.history.gold, (row) => row.tola24k)?.delta ?? null;
  const history = (rates.history.gold ?? []).map((row) => ({ date: row.date, value: row.tola24k }));
  if (!gold) return <p className="text-muted">The gold rate is not available right now.</p>;
  const rows = [
    ["24 karat", gold.tola24k, gold.tenGram24k, gold.gram24k],
    ["22 karat", gold.tola22k, gold.tenGram22k, gold.gram22k],
    [
      "21 karat",
      gold.tola21k,
      Math.round((gold.tola21k / GRAMS_PER_TOLA) * 10),
      Math.round(gold.tola21k / GRAMS_PER_TOLA),
    ],
    [
      "18 karat",
      gold.tola18k,
      Math.round((gold.tola18k / GRAMS_PER_TOLA) * 10),
      Math.round(gold.tola18k / GRAMS_PER_TOLA),
    ],
  ] as const;
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <RateCard label="24k gold per tola" value={rs(gold.tola24k)} delta={delta} sub={longDate(gold.date)} />
        <RateCard label="22k gold per tola" value={rs(gold.tola22k)} sub={`10 grams ${rs(gold.tenGram22k)}`} />
        <RateCard
          label="Silver per tola"
          value={rs(gold.silverTola)}
          sub={gold.silverSpotUsdOz ? `Spot $${gold.silverSpotUsdOz.toFixed(2)} per ounce` : undefined}
        />
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="bg-surface-2 text-sm text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Purity</th>
              <th className="px-4 py-2.5 text-right font-medium">Per tola</th>
              <th className="px-4 py-2.5 text-right font-medium">Per 10 grams</th>
              <th className="px-4 py-2.5 text-right font-medium">Per gram</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(([purity, tola, ten, gram]) => (
              <tr key={purity}>
                <td className="px-4 py-2.5 font-medium">{purity}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{rs(tola)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{rs(ten)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{rs(gram)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-4 py-3 text-xs text-muted">
          World spot price ${gold.spotUsdOz.toLocaleString("en-US", { maximumFractionDigits: 2 })} per troy ounce at Rs{" "}
          {gold.usdPkr.toFixed(2)} per dollar. One tola is {GRAMS_PER_TOLA} grams.
          {gold.premiumPct ? ` Includes a ${gold.premiumPct}% local premium.` : ""}
        </p>
      </div>
      <HistoryChart points={history} label="24k gold per tola" format={(value) => rs(value)} />
    </div>
  );
}

/** Petrol page: petrol, diesel, LPG and the chart. */
export function FuelSection() {
  const rates = useRates();
  const fuel = rates.fuel;
  const petrolDelta = changeFrom(rates.history.fuel, (row) => row.petrol)?.delta ?? null;
  const dieselDelta = changeFrom(rates.history.fuel, (row) => row.diesel)?.delta ?? null;
  const history = (rates.history.fuel ?? []).map((row) => ({ date: row.date, value: row.petrol }));
  if (!fuel) return <p className="text-muted">The fuel price is not available right now.</p>;
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <RateCard
          label="Petrol per litre"
          value={rs(fuel.petrol)}
          delta={petrolDelta}
          sub={`Effective ${longDate(fuel.date)}`}
        />
        <RateCard
          label="Diesel per litre"
          value={rs(fuel.diesel)}
          delta={dieselDelta}
          sub={`Effective ${longDate(fuel.date)}`}
        />
        {rates.lpg ? (
          <RateCard
            label="LPG per kg"
            value={rs(rates.lpg.perKg)}
            sub={rates.lpg.cylinder11kg ? `11.8 kg cylinder ${rs(rates.lpg.cylinder11kg)}` : undefined}
            note={`OGRA notification, ${longDate(rates.lpg.date)}`}
          />
        ) : (
          <RateCard label="LPG" value="—" sub="Monthly OGRA notice; added when published" />
        )}
      </div>
      <HistoryChart points={history} label="Petrol price per litre" format={(value) => `Rs ${value.toFixed(2)}`} />
    </div>
  );
}

/** One currency page: the rate, the converter, a ready-reckoner table and the chart. */
export function CurrencySection({ code, unit }: { code: string; unit: string }) {
  const rates = useRates();
  const open = rates.openMarket?.rates[code];
  const any = pkrFor(code, rates);
  const history = (rates.history.openMarket ?? [])
    .map((row) => ({ date: row.date, value: (row[code] as { sell: number } | undefined)?.sell ?? NaN }))
    .filter((row) => Number.isFinite(row.value));
  const delta =
    changeFrom(rates.history.openMarket, (row) => (row[code] as { sell: number } | undefined)?.sell)?.delta ?? null;
  if (!any) return <p className="text-muted">This rate is not available right now.</p>;
  const amounts = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <RateCard
          label={`1 ${unit} in rupees`}
          value={rs(any.rate)}
          delta={open ? delta : undefined}
          sub={longDate(any.date)}
        />
        <RateCard
          label="Buying"
          value={rs(open?.buy)}
          sub={open ? "Open market (ECAP)" : "Not published for this currency"}
        />
        <RateCard
          label="Selling"
          value={rs(open?.sell)}
          sub={open ? "Open market (ECAP)" : "Indicative rate shown left"}
        />
      </div>
      <Converter code={code} unit={unit} rate={any.rate} />
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="bg-surface-2 text-sm text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">{code}</th>
              <th className="px-4 py-2.5 text-right font-medium">PKR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {amounts.map((amount) => (
              <tr key={amount}>
                <td className="px-4 py-2 tabular-nums">{amount.toLocaleString("en-PK")}</td>
                <td className="px-4 py-2 text-right tabular-nums">{rs(amount * any.rate, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {history.length >= 2 && (
        <HistoryChart points={history} label={`${code} selling rate`} format={(value) => `Rs ${value.toFixed(2)}`} />
      )}
    </div>
  );
}

export { Change };

/** Silver page: per tola, 10 grams, gram and kilogram. Silver history is not kept, so there is no chart. */
export function SilverSection() {
  const rates = useRates();
  const gold = rates.gold;
  if (!gold?.silverTola) return <p className="text-muted">The silver rate is not available right now.</p>;
  const gram = gold.silverTola / GRAMS_PER_TOLA;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <RateCard label="Silver per tola" value={rs(gold.silverTola)} sub={longDate(gold.date)} />
      <RateCard label="Silver per 10 grams" value={rs(gram * 10)} />
      <RateCard label="Silver per gram" value={rs(gram)} />
      <RateCard
        label="Silver per kilogram"
        value={rs(gram * 1000)}
        sub={gold.silverSpotUsdOz ? `Spot $${gold.silverSpotUsdOz.toFixed(2)} per troy ounce` : undefined}
      />
    </div>
  );
}

/** LPG page: OGRA's monthly maximum consumer price per kg and per cylinder. */
export function LpgSection() {
  const rates = useRates();
  const lpg = rates.lpg;
  if (!lpg) return <p className="text-muted">The LPG price is not available right now.</p>;
  const domestic = lpg.cylinder11kg ?? Math.round(lpg.perKg * 11.8 * 100) / 100;
  const commercial = Math.round(lpg.perKg * 45.4 * 100) / 100;
  const weights = [1, 5, 11.8, 15, 45.4];
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <RateCard label="LPG per kg" value={rs(lpg.perKg)} sub={`Effective ${longDate(lpg.date)}`} />
        <RateCard label="Domestic cylinder, 11.8 kg" value={rs(domestic)} sub="Maximum consumer price" />
        <RateCard label="Commercial cylinder, 45.4 kg" value={rs(commercial)} sub="At the per-kg price" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="bg-surface-2 text-sm text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Weight</th>
              <th className="px-4 py-2.5 text-right font-medium">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {weights.map((kg) => (
              <tr key={kg}>
                <td className="px-4 py-2 tabular-nums">
                  {kg} kg{kg === 11.8 ? " (domestic cylinder)" : kg === 45.4 ? " (commercial cylinder)" : ""}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">{rs(Math.round(lpg.perKg * kg * 100) / 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-4 py-3 text-xs text-muted">
          OGRA notifies a maximum consumer price once a month. Shops may sell below it; in some areas they charge more,
          which is a breach of the notified price.
        </p>
      </div>
    </div>
  );
}

/** Gold rate by city. One national reference rate, so every city shows the same figure, with the note that says why. */
export function GoldCityTable() {
  const rates = useRates();
  const gold = rates.gold;
  if (!gold) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full text-left text-sm sm:text-base">
        <thead className="bg-surface-2 text-sm text-muted">
          <tr>
            <th className="px-4 py-2.5 font-medium">City</th>
            <th className="px-4 py-2.5 text-right font-medium">24k per tola</th>
            <th className="px-4 py-2.5 text-right font-medium">22k per tola</th>
            <th className="px-4 py-2.5 text-right font-medium">24k per 10 g</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {cities.map((city) => (
            <tr key={city}>
              <td className="px-4 py-2 font-medium">{city}</td>
              <td className="px-4 py-2 text-right tabular-nums">{rs(gold.tola24k)}</td>
              <td className="px-4 py-2 text-right tabular-nums">{rs(gold.tola22k)}</td>
              <td className="px-4 py-2 text-right tabular-nums">{rs(gold.tenGram24k)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-3 text-xs text-muted">
        Gold is priced nationally: the Karachi Sarafa association’s rate is the reference and the Lahore, Islamabad and
        other city associations follow it, usually within a few hundred rupees per tola. The figure here is the world
        price at today’s dollar rate, the same for every city; a local jeweller’s quote can sit slightly above or below
        it.
      </p>
    </div>
  );
}
