"use client";

import { useRates } from "@/components/RatesProvider";
import { longDate } from "@/lib/rates";

/** "Updated 20 October 2026 · source" line under a heading, from the live data. */
export function Updated({ date, source, url }: { date?: string; source?: string; url?: string }) {
  const live = useRates();
  const when = date ?? live.updated.slice(0, 10);
  return (
    <p className="mt-2 text-sm text-muted">
      Updated {longDate(when)}
      {source && (
        <>
          {" · "}
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              {source}
            </a>
          ) : (
            source
          )}
        </>
      )}
    </p>
  );
}
