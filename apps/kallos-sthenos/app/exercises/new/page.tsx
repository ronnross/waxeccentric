"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { appPath } from "@/lib/base-path";

const categories = ["strength", "cardio", "mobility", "stretching"];
const muscleGroups = ["upper push", "upper pull", "lower", "core", "full body"];

export default function NewExercisePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      description: form.get("description") || undefined,
      category: form.get("category") || undefined,
      muscle_group: form.get("muscle_group") || undefined,
      equipment: form.get("equipment") || undefined,
      image_url: form.get("image_url") || undefined,
      video_url: form.get("video_url") || undefined,
    };

    const res = await fetch(appPath("/api/exercises"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create exercise");
      if (data.fieldErrors) setFieldErrors(data.fieldErrors);
      setSubmitting(false);
      return;
    }

    router.push("/exercises");
    router.refresh();
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">New Exercise</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-stack">
        {error && (
          <div className="form-error">
            {Object.keys(fieldErrors).length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "var(--space-md)" }}>
                {Object.entries(fieldErrors).map(([field, msg]) => (
                  <li key={field}>
                    <strong>{field}</strong>: {msg}
                  </li>
                ))}
              </ul>
            ) : (
              error
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name *
          </label>
          <input
            id="name"
            name="name"
            required
            className="form-input"
            placeholder="e.g. Barbell Squat"
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
            placeholder="How to perform this exercise..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select id="category" name="category" className="form-select">
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="muscle_group" className="form-label">
              Muscle Group
            </label>
            <select
              id="muscle_group"
              name="muscle_group"
              className="form-select"
            >
              <option value="">Select...</option>
              {muscleGroups.map((mg) => (
                <option key={mg} value={mg}>
                  {mg}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="equipment" className="form-label">
            Equipment
          </label>
          <input
            id="equipment"
            name="equipment"
            className="form-input"
            placeholder="e.g. barbell, dumbbells, none"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image_url" className="form-label">
            Image URL
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            className="form-input"
            placeholder="e.g. https://images.example.com/squat-reference.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="video_url" className="form-label">
            Video URL
          </label>
          <input
            id="video_url"
            name="video_url"
            type="url"
            className="form-input"
            placeholder="e.g. https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn--primary"
          >
            {submitting ? "Creating..." : "Create Exercise"}
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
