"use client";

// Hands every component the rates that were baked in at build time, then fetches
// the live file once so a page built in the morning shows the evening's numbers.
// Inside the Android app the pages come from the app bundle, so the live file is
// fetched from the published address instead, and the last good copy is kept on
// the phone for when there is no signal.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { liveDataUrl } from "@/data/site";
import { rates as builtRates, type Rates } from "@/lib/rates";

const RatesContext = createContext<Rates>(builtRates);
const STORAGE_KEY = "rates-today:last";

function isNativeApp() {
  const capacitor = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(capacitor?.isNativePlatform?.());
}

function readStored(): Rates | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Rates) : null;
  } catch {
    return null;
  }
}

function store(rates: Rates) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rates));
  } catch {
    // Storage full or blocked: nothing to do, the fetched copy is still on screen.
  }
}

export function RatesProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<Rates>(builtRates);

  useEffect(() => {
    const native = isNativeApp();
    const stored = native ? readStored() : null;
    if (stored && stored.updated > builtRates.updated) setRates(stored);

    const url = native ? liveDataUrl : "/data/rates.json";
    const controller = new AbortController();
    fetch(`${url}?t=${Math.floor(Date.now() / 600_000)}`, { signal: controller.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((fresh: Rates | null) => {
        if (!fresh?.updated) return;
        const current = stored && stored.updated > builtRates.updated ? stored : builtRates;
        if (fresh.updated > current.updated) {
          setRates(fresh);
          if (native) store(fresh);
        }
      })
      .catch(() => {
        // Offline or blocked: the built-in or stored numbers stay on screen.
      });
    return () => controller.abort();
  }, []);

  return <RatesContext.Provider value={rates}>{children}</RatesContext.Provider>;
}

export function useRates() {
  return useContext(RatesContext);
}
