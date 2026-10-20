import type { Metadata } from "next";
import { TextPage } from "@/components/TextPage";
import { owner, siteName } from "@/data/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: `How to reach ${siteName} about a wrong rate, a missing currency or anything else.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <TextPage title="Contact">
      <p>
        Email <a href={`mailto:${owner.email}`}>{owner.email}</a>. Messages are read by {owner.name} in {owner.city},
        usually within a day or two.
      </p>
      <h2>Reporting a wrong rate</h2>
      <p>
        Say which page, which figure, what it should be and where you saw the correct figure. Every number on this site
        is read from a published document, so a wrong rate normally means the publisher changed its format; a report
        with the source helps fix it quickly.
      </p>
      <h2>Asking for a currency</h2>
      <p>
        Tell us the currency and where you would use the rate. Currencies that ECAP publishes can be added with buying
        and selling rates; others can be added as indicative rates.
      </p>
    </TextPage>
  );
}
