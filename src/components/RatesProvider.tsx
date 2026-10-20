"use client";

// Hands every component the rates that were baked in at build time, then fetches
// the live file once so a page built in the morning shows the evening's numbers.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { rates as builtRates, type Rates } from "@/lib/rates";

const RatesContext = createContext<Rates>(builtRates);

export function RatesProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<Rates>(builtRates);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/data/rates.json?t=${Math.floor(Date.now() / 600_000)}`, { signal: controller.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((fresh: Rates | null) => {
        if (fresh && fresh.updated > builtRates.updated) setRates(fresh);
      })
      .catch(() => {
        // Offline or blocked: the built-in numbers stay on screen.
      });
    return () => controller.abort();
  }, []);

  return <RatesContext.Provider value={rates}>{children}</RatesContext.Provider>;
}

export function useRates() {
  return useContext(RatesContext);
}
