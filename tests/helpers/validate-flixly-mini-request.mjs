/**
 * Pure preflight validation for the publicly documented Seedance 2.0 Mini settings.
 * This is a test-only contract guard, not wired to any provider or backend.
 */
const ALLOWED_DURATIONS = new Set([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
const ALLOWED_RESOLUTIONS = new Set(["480p", "720p"]);
const ALLOWED_ASPECT_RATIOS = new Set(["16:9", "9:16", "1:1", "21:9", "4:3", "3:4"]);

export function validateFlixlyMiniRequest(input = {}) {
  const errors = [];
  if (!Number.isInteger(input.duration) || !ALLOWED_DURATIONS.has(input.duration)) {
    errors.push("duration must be an integer from 4 through 15 seconds");
  }
  if (!ALLOWED_RESOLUTIONS.has(input.resolution)) {
    errors.push("resolution must be 480p or 720p");
  }
  if (!ALLOWED_ASPECT_RATIOS.has(input.aspectRatio)) {
    errors.push("aspectRatio must be one of 16:9, 9:16, 1:1, 21:9, 4:3, 3:4");
  }
  return { valid: errors.length === 0, errors };
}
