"use client";

import { useEffect } from "react";
import { appPath, BASE_PATH } from "@/lib/base-path";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register(appPath("/sw.js"), {
          scope: `${BASE_PATH}/`,
          updateViaCache: "none",
        });
      } catch (error) {
        console.error("Service worker registration failed", error);
      }
    };

    register();
  }, []);

  return null;
}
