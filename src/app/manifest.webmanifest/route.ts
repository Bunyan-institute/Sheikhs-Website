import publicManifest from "@/lib/public-manifest";

// An explicit route lets /admin use its own manifest metadata instead of the public default.
export function GET() {
  return Response.json(publicManifest(), { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "public, max-age=3600" } });
}
