"use client";

import { useEffect, useRef, useState } from "react";

interface RatingModalProps {
  routineName: string;
  onSubmit: (rating: number) => void;
  onClose: () => void;
}

export default function RatingModal({
  routineName,
  onSubmit,
  onClose,
}: RatingModalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  function ratingLabel(n: number): string {
    if (n <= 2) return "Too easy";
    if (n <= 4) return "Moderate";
    if (n <= 6) return "Challenging";
    if (n <= 8) return "Hard";
    return "Maximum effort";
  }

  return (
    <div
      className="video-modal-backdrop"
      ref={backdropRef}
      onClick={handleBackdropClick}
    >
      <div className="video-modal" style={{ maxWidth: 420 }}>
        <div className="video-modal__header">
          <h3 className="video-modal__title">Rate Your Workout</h3>
          <button
            className="video-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="video-modal__body">
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.875rem",
              marginBottom: "var(--space-md)",
            }}
          >
            How difficult was <strong>{routineName}</strong>?
          </p>

          <div className="rating-grid">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`rating-btn${selected === n ? " rating-btn--selected" : ""}`}
                onClick={() => setSelected(n)}
                aria-label={`Rate ${n} out of 10`}
              >
                {n}
              </button>
            ))}
          </div>

          {selected && <p className="rating-label">{ratingLabel(selected)}</p>}

          <div
            style={{
              display: "flex",
              gap: "var(--space-sm)",
              marginTop: "var(--space-md)",
            }}
          >
            <button
              className="btn btn--ghost"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Skip
            </button>
            <button
              className="btn btn--primary"
              disabled={!selected}
              onClick={() => selected && onSubmit(selected)}
              style={{ flex: 1 }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
