"use client";

// Amount in a foreign currency to rupees and back, using the rate on the page.
import { useId, useState } from "react";

export function Converter({ code, unit, rate }: { code: string; unit: string; rate: number }) {
  const [amount, setAmount] = useState("1");
  const [direction, setDirection] = useState<"toPkr" | "toCurrency">("toPkr");
  const id = useId();
  const number = Number(amount.replace(/,/g, ""));
  const valid = Number.isFinite(number) && number >= 0;
  const result = !valid ? null : direction === "toPkr" ? number * rate : number / rate;
  const resultText =
    result === null
      ? "Enter a number"
      : direction === "toPkr"
        ? `Rs ${result.toLocaleString("en-PK", { minimumFractionDigits: result < 1000 ? 2 : 0, maximumFractionDigits: 2 })}`
        : `${result.toLocaleString("en-PK", { maximumFractionDigits: 2 })} ${code}`;

  return (
    <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex-1" htmlFor={id}>
          <span className="block text-sm font-medium text-muted">Amount in {direction === "toPkr" ? code : "PKR"}</span>
          <input
            id={id}
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-lg"
          />
        </label>
        <button
          type="button"
          onClick={() => setDirection(direction === "toPkr" ? "toCurrency" : "toPkr")}
          className="min-h-11 rounded-lg border border-line px-3 text-sm font-medium hover:bg-surface-2"
          aria-label="Swap direction"
        >
          ⇄ Swap
        </button>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold" aria-live="polite">
        {resultText}
      </p>
      <p className="mt-1 text-xs text-muted">
        1 {unit} = Rs {rate.toLocaleString("en-PK", { maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}
