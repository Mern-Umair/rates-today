"use client"; // Error boundaries must be Client Components

// Replaces the root layout when it fails, so it carries its own document and styles.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "4rem 1rem", textAlign: "center" }}>
        <title>Something went wrong | FormKB</title>
        <h1 style={{ fontSize: "1.75rem" }}>Something went wrong</h1>
        <p style={{ maxWidth: "32rem", margin: "1rem auto", lineHeight: 1.6 }}>
          The page could not be shown. Your picture was not uploaded anywhere. Please try again.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          style={{
            minHeight: "3rem",
            padding: "0 1.5rem",
            border: 0,
            borderRadius: "0.5rem",
            background: "#1d4ed8",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
