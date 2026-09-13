export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("Origin");

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

/** Preserve Astro's default form-origin guard outside the explicitly handled plan POSTs. */
export function isCrossOriginFormRequest(request: Request): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return false;
  if (request.headers.get("Origin") === new URL(request.url).origin) return false;
  const contentType = request.headers.get("Content-Type");
  return (
    contentType === null ||
    ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"].some((type) =>
      contentType.toLowerCase().includes(type),
    )
  );
}
