export async function httpJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "Content-Type": "application/json",
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const body = isJson
    ? await res.json().catch(() => undefined)
    : await res.text().catch(() => undefined);

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "message" in (body as any)
        ? String((body as any).message)
        : `Request failed (${res.status})`;

    throw new Error(message);
  }

  return body as T;
}
