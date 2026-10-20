"use client";

// "Share today's rates" button. In the Android app it opens the phone's share sheet
// (WhatsApp is the first thing most people pick); on the website it uses the browser's
// share sheet where there is one, otherwise it opens WhatsApp directly.
import { useRates } from "@/components/RatesProvider";
import { playUrl, siteName } from "@/data/site";
import { longDate, pkrFor, rs, type Rates } from "@/lib/rates";

type Kind = "all" | "dollar" | "gold" | "petrol";

function isNativeApp() {
  const capacitor = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(capacitor?.isNativePlatform?.());
}

function message(kind: Kind, rates: Rates): string {
  const usd = pkrFor("USD", rates);
  const aed = pkrFor("AED", rates);
  const sar = pkrFor("SAR", rates);
  const date = longDate(usd?.date ?? rates.updated.slice(0, 10));
  const lines: string[] = [];
  if (kind === "all" || kind === "dollar") {
    lines.push(`Dollar: ${rs(usd?.rate)}`);
    if (aed) lines.push(`Dirham (AED): ${rs(aed.rate)}`);
    if (sar) lines.push(`Riyal (SAR): ${rs(sar.rate)}`);
  }
  if (kind === "all" || kind === "gold") {
    lines.push(`Gold 24k: ${rs(rates.gold?.tola24k)} per tola`);
    lines.push(`Gold 22k: ${rs(rates.gold?.tola22k)} per tola`);
  }
  if (kind === "all" || kind === "petrol") {
    lines.push(`Petrol: ${rs(rates.fuel?.petrol)} per litre`);
    lines.push(`Diesel: ${rs(rates.fuel?.diesel)} per litre`);
  }
  return [
    `Aaj ke rates, ${date}:`,
    ...lines,
    "",
    `${siteName} app (official sources, updated twice a day):`,
    playUrl,
  ].join("\n");
}

export function ShareRates({ kind = "all", className = "" }: { kind?: Kind; className?: string }) {
  const rates = useRates();

  async function share() {
    const text = message(kind, rates);
    try {
      if (isNativeApp()) {
        const { Share } = await import("@capacitor/share");
        await Share.share({ title: `${siteName}: aaj ke rates`, text, dialogTitle: "Share today's rates" });
        return;
      }
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: siteName, text });
        return;
      }
    } catch {
      // The person closed the share sheet; nothing to do.
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg bg-ok px-4 text-base font-semibold text-white transition-colors hover:bg-ok-strong ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.47 15.02L2 22l5.12-1.52A9.95 9.95 0 1 0 12.04 2Zm0 18.17a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.04.9.9-2.96-.2-.3a8.23 8.23 0 1 1 6.84 3.69Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.1-.5.11-.12.25-.3.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.16 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.56.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
      Share on WhatsApp
    </button>
  );
}
