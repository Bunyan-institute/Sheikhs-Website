import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const projectRoot = path.resolve(import.meta.dirname);

const nextConfig: NextConfig = {
  // Self-contained server bundle for Docker (node server.js).
  output: "standalone",
  agentRules: false, // do not auto-generate AGENTS.md / CLAUDE.md into the repo
  outputFileTracingRoot: projectRoot,
  turbopack: { root: projectRoot },
  // NEXT_DIST_DIR lets a production build live beside a running dev server (used for PWA testing).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The admin worker and manifest must always be revalidated so updates roll out promptly.
      { source: "/admin-sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }, { key: "Service-Worker-Allowed", value: "/admin" }, { key: "Content-Type", value: "application/javascript; charset=utf-8" }] },
      { source: "/admin.webmanifest", headers: [{ key: "Content-Type", value: "application/manifest+json" }, { key: "Cache-Control", value: "no-cache" }] },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default withNextIntl(nextConfig);
