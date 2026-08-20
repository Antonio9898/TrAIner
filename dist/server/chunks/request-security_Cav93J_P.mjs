globalThis.process ??= {};
globalThis.process.env ??= {};
function isSameOriginRequest(request) {
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
export {
  isSameOriginRequest as i
};
