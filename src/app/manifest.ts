import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Temperance",
    short_name: "Temperance",
    description:
      "and in knowledge, self-control; and in self-control, perseverance; and in perseverance, godliness. — 2 Peter 1:6",
    start_url: "/",
    display: "standalone",
    background_color: "#f6efdf",
    theme_color: "#f6efdf",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
