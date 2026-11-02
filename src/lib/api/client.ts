const API_URL = process.env.BUNYAN_API_URL ?? "http://localhost:3000";
const API_KEY = process.env.BUNYAN_API_KEY ?? "";

export interface FetchOptions {
  path: string;
  params?: Record<string, string | string[] | undefined>;
  tags?: string[];
  revalidate?: number | false;
  method?: "GET" | "POST";
  body?: unknown;
}

export class BunyanApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly path: string,
    message?: string,
  ) {
    super(message ?? `Bunyan API error ${status} on ${path}`);
    this.name = "BunyanApiError";
  }
}

const LISTING_PATHS = [
  "/media",
  "/series",
  "/articles",
  "/fatwas",
  "/courses",
  "/events",
  "/categories",
  "/tags",
  "/search",
];

export async function bunyan<T>(options: FetchOptions): Promise<T> {
  const url = new URL(`/v1${options.path}`, API_URL);

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) url.searchParams.append(key, v);
      } else {
        url.searchParams.set(key, value);
      }
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${API_KEY}`,
  };

  const init: RequestInit & { next?: { tags?: string[]; revalidate?: number | false } } = {
    method: options.method ?? "GET",
    headers,
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body);
  }

  if (options.method !== "POST") {
    init.next = {
      tags: options.tags,
      revalidate: options.revalidate ?? 60,
    };
  }

  try {
    const res = await fetch(url.toString(), init);

    if (!res.ok) {
      if (LISTING_PATHS.includes(options.path)) {
        return {
          object: "list",
          data: [],
          has_more: false,
          next_cursor: null,
        } as T;
      }
      throw new BunyanApiError(res.status, options.path);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new BunyanApiError(res.status, options.path, "Non-JSON response from API");
    }

    return (await res.json()) as T;
  } catch (err: any) {
    if (LISTING_PATHS.includes(options.path) && options.method !== "POST") {
      return {
        object: "list",
        data: [],
        has_more: false,
        next_cursor: null,
      } as T;
    }
    throw err;
  }
}
