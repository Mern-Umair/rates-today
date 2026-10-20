import Link from "next/link";
import { Logo } from "@/components/Icon";
import { currencyPages, ratePages } from "@/data/pages";
import { siteName } from "@/data/site";

const pages = [
  { href: "/about", label: "About and sources" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
];

const linkClass = "inline-flex min-h-9 items-center hover:text-fg hover:underline";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold">
          <Logo className="size-8" />
          {siteName}
        </Link>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          Today’s dollar, gold, petrol and Gulf currency rates in Pakistan, taken every day from the State Bank, ECAP
          and OGRA publications and the world gold price.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-4">
        <nav aria-label="Rates">
          <p className="font-semibold">Rates</p>
          <ul className="mt-2 text-sm text-muted">
            {ratePages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className={linkClass}>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Gulf currencies">
          <p className="font-semibold">Gulf and UK</p>
          <ul className="mt-2 text-sm text-muted">
            {currencyPages
              .filter((page) => ["AED", "SAR", "GBP", "QAR", "KWD", "OMR", "BHD"].includes(page.code))
              .map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className={linkClass}>
                    {page.code} to PKR
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <nav aria-label="Other currencies">
          <p className="font-semibold">Other currencies</p>
          <ul className="mt-2 text-sm text-muted">
            {currencyPages
              .filter((page) => ["USD", "EUR", "CAD", "AUD", "MYR", "CNY", "TRY", "JPY"].includes(page.code))
              .map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className={linkClass}>
                    {page.code} to PKR
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <nav aria-label="Site">
          <p className="font-semibold">{siteName}</p>
          <ul className="mt-2 text-sm text-muted">
            {pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className={linkClass}>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-5xl px-4 py-5 text-sm leading-relaxed text-muted sm:px-6">
          © {new Date().getFullYear()} {siteName}. An independent information site, not run by or connected with the
          State Bank of Pakistan, ECAP, OGRA or any exchange company. Rates are published for information only; the
          rate you get at a counter can differ. Check with your bank or exchange company before a large transaction.
        </p>
      </div>
    </footer>
  );
}
