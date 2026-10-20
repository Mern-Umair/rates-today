import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { breadcrumbData, JsonLd, pageData } from "@/components/JsonLd";
import { LpgSection } from "@/components/RateSections";
import { Updated } from "@/components/Updated";
import { pageMeta } from "@/lib/meta";
import { longDate, monthYear, rates, rs } from "@/lib/rates";

const lpg = rates.lpg;
const month = monthYear(lpg?.date);
const domestic = lpg ? (lpg.cylinder11kg ?? Math.round(lpg.perKg * 11.8 * 100) / 100) : null;
const path = "/lpg-price-today-pakistan";

const title = `LPG Price Today in Pakistan: ${rs(lpg?.perKg)} per kg, 11.8 kg Cylinder ${rs(domestic)} (${month || "OGRA"})`;
const description = `LPG price in Pakistan for ${month}: ${rs(lpg?.perKg)} per kg and ${rs(domestic)} for the 11.8 kg domestic cylinder, the maximum consumer price notified by OGRA, effective ${longDate(lpg?.date)}. Per-kg table for every cylinder size.`;

export const metadata: Metadata = pageMeta({ title, description, path });

const lead = lpg
  ? `For ${month}, the LPG price in Pakistan is ${rs(lpg.perKg)} per kg, which makes the 11.8 kg domestic cylinder ${rs(domestic)}, the maximum consumer price OGRA notified with effect from ${longDate(lpg.date)}.`
  : "OGRA's LPG price for this month has not been entered yet; it appears here as soon as the notification is published.";

const faq = [
  {
    q: "What is the LPG price in Pakistan today per kg?",
    a: lpg
      ? `${rs(lpg.perKg)} per kg for ${month}, as notified by OGRA. The price is set once a month, so today's price is the month's price unless OGRA issues a revision.`
      : "The figure appears at the top of this page as soon as OGRA's monthly notification is entered.",
  },
  {
    q: "Aaj LPG ka rate kya hai?",
    a: lpg
      ? `${month} ke liye LPG ${rs(lpg.perKg)} fi kilo hai aur 11.8 kilo ka gharelu cylinder ${rs(domestic)} ka. Yeh OGRA ki notify ki hui zyada se zyada qeemat hai; dukandar is se zyada nahi le sakta.`
      : "Is mahine ka rate OGRA ke notification ke baad yahan aa jayega.",
  },
  {
    q: "Is the LPG price the same in Lahore, Karachi and Islamabad?",
    a: "OGRA notifies one maximum consumer price for the whole country, so the ceiling is the same in Lahore, Karachi, Islamabad, Peshawar and Quetta. Shop prices vary: distributors in distant or hilly areas often charge above the ceiling, which is a breach of the notified price, while large cities sometimes sell a little below it.",
  },
  {
    q: "How is the LPG price worked out?",
    a: "OGRA builds the monthly price from the Saudi Aramco contract price (CP) for propane and butane, converted at the month's exchange rate, plus the producer price, marketing and distribution margins and taxes. When the dollar rises or the Aramco CP goes up, the LPG price follows the next month.",
  },
  {
    q: "When does the LPG price change?",
    a: "On the first of each month, when OGRA issues the notification for that month. Winter months usually bring higher prices because demand and the Aramco CP both rise.",
  },
];

export default function LpgPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">LPG price today in Pakistan</h1>
      <Updated date={lpg?.date} source={lpg?.source} url={lpg?.url} />
      <p className="lead mt-4 max-w-3xl text-lg">{lead}</p>
      <div className="mt-6">
        <LpgSection />
      </div>
      <section className="prose mt-10">
        <h2>LPG, petrol and diesel</h2>
        <p>
          Unlike <Link href="/petrol-price-today-pakistan">petrol and diesel</Link>, which OGRA now revises every day,
          LPG is priced once a month. The per-kg figure above is the maximum a shop may charge; a filled cylinder should
          not cost more than its weight multiplied by that figure. Keep the receipt if you are charged more.
        </p>
      </section>
      <Faq items={faq} />
      <JsonLd data={pageData({ name: title, description, path, dateModified: rates.updated })} />
      <JsonLd data={breadcrumbData([{ name: "LPG price today", path }])} />
    </article>
  );
}
