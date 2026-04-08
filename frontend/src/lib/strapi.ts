const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

type StrapiQuery = Record<string, string | number | boolean>;

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (STRAPI_TOKEN) headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  return headers;
}

function buildUrl(path: string, query?: StrapiQuery): string {
  const url = new URL(`/api${path}`, STRAPI_URL);
  if (query) {
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  return url.toString();
}

export async function strapiGet<T>(path: string, query?: StrapiQuery): Promise<T> {
  const res = await fetch(buildUrl(path, query), {
    headers: buildHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

export async function strapiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ data: body }),
  });
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}
