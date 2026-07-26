"use client";

import { useEffect, useState } from "react";

const LAST_ONLINE_KEY = "kallos:last-online";

export default function OfflineStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [lastOnline, setLastOnline] = useState<string | null>(null);

  useEffect(() => {
    const rawLastOnline = window.localStorage.getItem(LAST_ONLINE_KEY);
    if (rawLastOnline) setLastOnline(rawLastOnline);

    const update = () => {
      if (navigator.onLine) {
        const now = new Date().toISOString();
        window.localStorage.setItem(LAST_ONLINE_KEY, now);
        setLastOnline(now);
      }
      setIsOffline(!navigator.onLine);
    };

    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!isOffline) return null;

  const lastOnlineText = lastOnline
    ? new Date(lastOnline).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "unknown";

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        right: "var(--space-md)",
        bottom: "calc(var(--nav-height) + var(--space-md))",
        zIndex: 200,
        background: "var(--color-warning-light)",
        color: "var(--color-text)",
        border: "1px solid var(--color-warning)",
        borderRadius: "var(--radius-md)",
        padding: "6px 10px",
        boxShadow: "var(--shadow-md)",
        fontSize: "0.8125rem",
        fontWeight: 700,
      }}
    >
      <div>Offline mode</div>
      <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>
        Last online: {lastOnlineText}
      </div>
    </div>
  );
}
