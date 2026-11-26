import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sheikh Muhammed Ferej Megeno | Official Platform",
    short_name: "Sheikh Ferej",
    description:
      "Official Islamic knowledge platform, fatwa archive, courses, and educational lectures of Sheikh Muhammed Ferej Megeno.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#EDF4F0",
    theme_color: "#0D3E2F",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
