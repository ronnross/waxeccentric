import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="card" style={{ maxWidth: 560, margin: "8vh auto" }}>
      <h2 className="card-title" style={{ marginBottom: "var(--space-sm)" }}>
        You are offline
      </h2>
      <p
        style={{
          color: "var(--color-text-muted)",
          marginBottom: "var(--space-md)",
        }}
      >
        A network connection is required to load this page. Check your
        connection and try again.
      </p>
      <Link href="/" className="btn btn--primary">
        Go Home
      </Link>
    </div>
  );
}
