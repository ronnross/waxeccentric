"use client";

import { useState } from "react";
import VideoModal from "@/components/VideoModal";
import type { SectionExercise } from "@/lib/schemas/routine";
import { formatLadderReps, formatRirBadge, formatSetsReps } from "@/lib/utils";

export default function ExerciseRowWithVideo({ ex }: { ex: SectionExercise }) {
  const [showVideo, setShowVideo] = useState(false);
  const rirBadge = formatRirBadge(ex.rir);

  return (
    <>
      <div className="exercise-item">
        <span className="exercise-position">
          {ex.superset_group
            ? `${ex.superset_group}${ex.position}`
            : ex.position}
        </span>
        <div className="exercise-info">
          <div className="exercise-name">
            {ex.priority && (
              <svg
                className="priority-badge"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            {ex.exercise.video_url ? (
              <span
                className="exercise-video-link"
                onClick={() => setShowVideo(true)}
              >
                {ex.exercise.name}
                <svg
                  className="exercise-video-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            ) : (
              ex.exercise.name
            )}
            {ex.per_side && (
              <span
                className="badge badge--warning"
                style={{ marginLeft: 6, fontSize: "0.6875rem" }}
              >
                per side
              </span>
            )}
          </div>
          <div className="exercise-meta">
            <span>
              {ex.reps_ladder
                ? formatLadderReps(ex.reps_ladder)
                : formatSetsReps(ex.sets, ex.reps, ex.duration_seconds)}
            </span>
            {ex.rest_seconds && <span>Rest: {ex.rest_seconds}s</span>}
            {rirBadge && <span className="rir-badge">{rirBadge}</span>}
          </div>
          {ex.notes && (
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {ex.notes}
            </div>
          )}
        </div>
      </div>

      {showVideo && ex.exercise.video_url && (
        <VideoModal
          videoUrl={ex.exercise.video_url}
          exerciseName={ex.exercise.name}
          onClose={() => setShowVideo(false)}
        />
      )}
    </>
  );
}
