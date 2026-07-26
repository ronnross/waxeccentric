"use client";

import { useEffect, useRef } from "react";

interface VideoModalProps {
  videoUrl: string;
  exerciseName: string;
  onClose: () => void;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export default function VideoModal({
  videoUrl,
  exerciseName,
  onClose,
}: VideoModalProps) {
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

  const ytId = getYouTubeId(videoUrl);

  return (
    <div
      className="video-modal-backdrop"
      ref={backdropRef}
      onClick={handleBackdropClick}
    >
      <div className="video-modal">
        <div className="video-modal__header">
          <h3 className="video-modal__title">{exerciseName}</h3>
          <button
            className="video-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="video-modal__body">
          {ytId ? (
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
              }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1`}
                title={`${exerciseName} demo`}
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
          ) : (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{ width: "100%", textAlign: "center" }}
            >
              Open Video &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
