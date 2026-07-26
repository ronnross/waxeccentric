"use client";

import { useState } from "react";

export default function CopyToken({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <code
      className={`theme-token-copy${copied ? " theme-token-copy--copied" : ""}`}
      onClick={handleCopy}
      title="Click to copy"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCopy();
      }}
    >
      {copied ? "Copied!" : text}
    </code>
  );
}
