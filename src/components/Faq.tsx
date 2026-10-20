import { JsonLd } from "@/components/JsonLd";

export type Question = { q: string; a: string };

/** Questions people search for, with the answers marked up so search engines can read them. */
export function Faq({ items, heading = "Questions people ask" }: { items: Question[]; heading?: string }) {
  return (
    <section className="mt-10" aria-labelledby="faq">
      <h2 id="faq" className="text-xl font-semibold">
        {heading}
      </h2>
      <dl className="mt-4 divide-y divide-line rounded-xl border border-line bg-surface">
        {items.map((item) => (
          <div key={item.q} className="p-4 sm:p-5">
            <dt className="font-semibold">{item.q}</dt>
            <dd className="mt-1.5 leading-relaxed text-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </section>
  );
}
