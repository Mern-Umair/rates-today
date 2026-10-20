import Link from "next/link";
import { Logo } from "@/components/Icon";
import { ratePages } from "@/data/pages";
import { siteName } from "@/data/site";

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight">
          <Logo />
          {siteName}
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center text-base font-medium">
            {ratePages.slice(0, 3).map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="flex min-h-11 items-center rounded-lg px-2.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:px-3.5"
                >
                  {page.short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
