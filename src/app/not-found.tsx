import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted">That page does not exist. The resizer and the list of forms are on the home page.</p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-accent px-6 font-semibold text-accent-fg"
      >
        Go to the home page
      </Link>
    </div>
  );
}
