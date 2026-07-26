"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function ExerciseSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.replace(`/exercises?${params.toString()}`);
    }, 250);
  }

  return (
    <input
      type="search"
      className="form-input"
      placeholder="Search exercises…"
      defaultValue={initial}
      onChange={(e) => handleChange(e.target.value)}
      aria-label="Search exercises"
    />
  );
}
