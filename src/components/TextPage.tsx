import type { ReactNode } from "react";

export function TextPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {updated && <p className="mt-3 text-sm text-muted">Last updated {updated}</p>}
      <div className="prose mt-2">{children}</div>
    </div>
  );
}
