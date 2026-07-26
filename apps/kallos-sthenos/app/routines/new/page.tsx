"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { appPath } from "@/lib/base-path";

export default function NewRoutinePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      description: form.get("description") || undefined,
    };

    const res = await fetch(appPath("/api/routines"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create routine");
      setSubmitting(false);
      return;
    }

    const routine = await res.json();
    router.push(`/routines/${routine.id}/edit`);
    router.refresh();
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">New Routine</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-stack">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name *
          </label>
          <input
            id="name"
            name="name"
            required
            className="form-input"
            placeholder="e.g. Upper Body A"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            placeholder="Notes about this routine..."
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn--primary"
          >
            {submitting ? "Creating..." : "Create & Add Exercises"}
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
