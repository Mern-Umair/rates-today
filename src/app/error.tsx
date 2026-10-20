"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function PageError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong on this page</h1>
      <p className="mt-3 leading-relaxed text-muted">
        Your picture was not uploaded anywhere and nothing was lost. Try again, and if it keeps happening, reload the
        page or open it in another browser.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-accent px-6 font-semibold text-accent-fg"
      >
        Try again
      </button>
    </div>
  );
}
