import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { owner, siteName } from "@/data/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Terms of use",
  description: `The terms for using ${siteName}: rates are published for information only and are not financial advice.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <TextPage title="Terms of use" updated="20 October 2026">
      <p>By using {siteName} you agree to these terms. They are short because the site is simple.</p>

      <h2>Information only</h2>
      <p>
        Every rate on this site is a reference figure taken from a published source and shown with its date. It is not
        an offer to buy or sell, not a quote, and not financial advice. The rate you receive from a bank, exchange
        company, jeweller or petrol pump is set by them, and can differ. Check with them before any transaction that
        matters to you.
      </p>

      <h2>Accuracy</h2>
      <p>
        We take care to read each publication correctly and to show the date it carries, but we cannot promise that a
        figure is free of error or that a source has not changed after we read it. If you find a mistake, please{" "}
        <Link href="/contact">tell us</Link>.
      </p>

      <h2>No liability</h2>
      <p>
        To the extent the law allows, {owner.name} and {siteName} are not liable for any loss arising from use of the
        site or reliance on a figure shown on it.
      </p>

      <h2>Using the content</h2>
      <p>
        You may quote rates from this site with a link to the page. The published figures belong to their publishers;
        the text, design and code of the site belong to {owner.name}. Automated copying of the site is not permitted
        without permission.
      </p>

      <h2>Changes</h2>
      <p>These terms may change; the date at the top shows the current version. Questions: {owner.email}.</p>
    </TextPage>
  );
}
