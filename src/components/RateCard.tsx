import Link from "next/link";
import { rs } from "@/lib/rates";

/** Up or down against the previous published figure. */
export function Change({ delta, unit = "" }: { delta: number | null | undefined; unit?: string }) {
  if (delta === null || delta === undefined || delta === 0) {
    return <span className="text-sm text-muted">no change</span>;
  }
  const up = delta > 0;
  return (
    <span className={`text-sm font-medium ${up ? "text-danger" : "text-ok"}`}>
      {up ? "▲" : "▼"} {rs(Math.abs(delta), Math.abs(delta) >= 1000 ? 0 : 2)}
      {unit}
    </span>
  );
}

export function RateCard({
  label,
  value,
  sub,
  delta,
  href,
  note,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: number | null;
  href?: string;
  note?: string;
}) {
  const body = (
    <>
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {sub && <span className="text-sm text-muted">{sub}</span>}
        {delta !== undefined && <Change delta={delta} />}
      </div>
      {note && <p className="mt-2 text-xs text-muted">{note}</p>}
    </>
  );
  const className = "block rounded-xl border border-line bg-surface p-4 sm:p-5";
  return href ? (
    <Link href={href} className={`${className} transition-colors hover:border-accent`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
