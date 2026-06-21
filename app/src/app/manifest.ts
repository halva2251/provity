import type { MetadataRoute } from "next";

// Next.js generiert daraus /manifest.webmanifest und verlinkt es automatisch
// im <head>. Macht ProVity als PWA auf dem Smartphone installierbar (Testfall T-08).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ProVity — Produktivität",
    short_name: "ProVity",
    description:
      "Produktivitäts-PWA mit Notizen, Todos, Pomodoro und Dashboard",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    lang: "de",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
