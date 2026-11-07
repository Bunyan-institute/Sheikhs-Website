import React from "react";

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>> | any;
}

/**
 * Safely renders a Schema.org JSON-LD script tag with escaped HTML characters to prevent XSS.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
