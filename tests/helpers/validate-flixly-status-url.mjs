/**
 * Test-only URL policy for a possible Flixly status_url.
 * This validates a URL; it does not fetch it or prove that the provider requires it.
 */
const ALLOWED_ORIGINS = new Set(["https://www.flixly.ai"]);

export function validateFlixlyStatusUrl(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return { valid: false, reason: "missing_status_url" };
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    return { valid: false, reason: "invalid_url" };
  }
  if (url.protocol !== "https:") {
    return { valid: false, reason: "https_required" };
  }
  if (!ALLOWED_ORIGINS.has(url.origin)) {
    return { valid: false, reason: "origin_not_allowlisted" };
  }
  if (url.username || url.password) {
    return { valid: false, reason: "embedded_credentials_forbidden" };
  }
  if (url.port && url.port !== "443") {
    return { valid: false, reason: "nonstandard_port_forbidden" };
  }
  return { valid: true, url: url.toString() };
}
