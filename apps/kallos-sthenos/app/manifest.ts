import type { MetadataRoute } from "next";
import { appPath, BASE_PATH } from "@/lib/base-path";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kallos Sthenos",
    short_name: "Kallos",
    description: "Personal workout planning app",
    start_url: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#FAFAF5",
    theme_color: "#1A1A1A",
    icons: [
      {
        src: appPath("/icons/icon-192.svg"),
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: appPath("/icons/icon-512.svg"),
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: appPath("/icons/icon-512-maskable.svg"),
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
