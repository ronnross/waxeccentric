"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExerciseHistory from "@/components/ExerciseHistory";
import { appPath } from "@/lib/base-path";
import type { Exercise } from "@/lib/schemas/exercise";

const categories = ["strength", "cardio", "mobility", "stretching"];
const muscleGroups = ["upper push", "upper pull", "lower", "core", "full body"];

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

function getExerciseVisual(exercise: Exercise): string | null {
  if (exercise.image_url) return exercise.image_url;
  if (!exercise.video_url) return null;

  const ytId = getYouTubeId(exercise.video_url);
  if (!ytId) return null;
  return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
}

export default function ExerciseDetailClient({
  exercise,
}: {
  exercise: Exercise;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
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
      image_url: form.get("image_url") || "",
      video_url: form.get("video_url") || "",
    };

    const res = await fetch(appPath(`/api/exercises/${exercise.id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update");
      if (data.fieldErrors) setFieldErrors(data.fieldErrors);
      setSubmitting(false);
      return;
    }

    setEditing(false);
    setSubmitting(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this exercise?")) return;

    const res = await fetch(appPath(`/api/exercises/${exercise.id}`), {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete");
      return;
    }

    router.push("/exercises");
    router.refresh();
  }

  if (editing) {
    return (
      <>
        <div className="page-header">
          <h2 className="page-title">Edit Exercise</h2>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            <button
              className="btn btn--secondary"
              onClick={() => {
                setEditing(false);
                setError("");
                setFieldErrors({});
              }}
            >
              Exit Edit
            </button>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="form-stack">
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
              defaultValue={exercise.name}
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
              defaultValue={exercise.description ?? ""}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                defaultValue={exercise.category ?? ""}
              >
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
                defaultValue={exercise.muscle_group ?? ""}
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
              defaultValue={exercise.equipment ?? ""}
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
              defaultValue={exercise.image_url ?? ""}
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
              defaultValue={exercise.video_url ?? ""}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn--primary"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">{exercise.name}</h2>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button
            className="btn btn--secondary"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button className="btn btn--danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="form-error" style={{ marginBottom: "var(--space-md)" }}>
          {error}
        </div>
      )}

      {(() => {
        const visualUrl = getExerciseVisual(exercise);
        if (visualUrl) {
          return (
            <div className="card" style={{ marginBottom: "var(--space-md)" }}>
              <Image
                src={visualUrl}
                alt={`${exercise.name} reference`}
                width={1200}
                height={675}
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 320,
                  objectFit: "cover",
                  borderRadius: "var(--radius-sm)",
                }}
              />
            </div>
          );
        }

        return (
          <div
            className="card"
            style={{
              marginBottom: "var(--space-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 180,
              color: "var(--color-text-muted)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              width={28}
              height={28}
              aria-label="No exercise visual"
            >
              <path d="M3 7.25A2.25 2.25 0 0 1 5.25 5h13.5A2.25 2.25 0 0 1 21 7.25v9.5A2.25 2.25 0 0 1 18.75 19H5.25A2.25 2.25 0 0 1 3 16.75v-9.5Z" />
              <path d="m8.25 10.25 1.9 1.9a.75.75 0 0 0 1.06 0l2.27-2.27a.75.75 0 0 1 1.06 0l1.2 1.2" />
              <circle cx="8.25" cy="8.5" r="1" />
            </svg>
          </div>
        );
      })()}

      <div className="card">
        {exercise.description && (
          <p style={{ marginBottom: "var(--space-md)" }}>
            {exercise.description}
          </p>
        )}
        <div
          style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}
        >
          {exercise.category && (
            <span className="badge badge--primary">{exercise.category}</span>
          )}
          {exercise.muscle_group && (
            <span className="badge">{exercise.muscle_group}</span>
          )}
          {exercise.equipment && (
            <span className="badge">{exercise.equipment}</span>
          )}
        </div>
      </div>

      {exercise.video_url &&
        (() => {
          const ytId = getYouTubeId(exercise.video_url);
          if (ytId) {
            return (
              <div className="card" style={{ marginTop: "var(--space-md)" }}>
                <h3 style={{ marginBottom: "var(--space-sm)" }}>Demo Video</h3>
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                  }}
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                    title={`${exercise.name} demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                </div>
              </div>
            );
          }
          return (
            <div className="card" style={{ marginTop: "var(--space-md)" }}>
              <h3 style={{ marginBottom: "var(--space-sm)" }}>Demo Video</h3>
              <a
                href={exercise.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary"
              >
                Watch Video &rarr;
              </a>
            </div>
          );
        })()}

      <ExerciseHistory exerciseId={exercise.id} />
    </>
  );
}
