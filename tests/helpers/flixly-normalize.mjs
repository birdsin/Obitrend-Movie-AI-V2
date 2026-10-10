/**
 * Pure Flixly response normalizer used by the isolated contract tests.
 *
 * No network, database, storage, environment, or credit side effects.
 * Before production use, reconcile the aliases and status semantics with the
 * current official Flixly API contract and explicitly review integration.
 */
export function normalizeFlixlyResponse(payload) {
  const candidates = [
    payload,
    payload?.data,
    payload?.result,
    payload?.generation
  ].filter(Boolean);

  const rawState = String(
    candidates.map((item) => item?.status).find((value) => value != null) || ""
  ).trim().toLowerCase();

  const outputUrl = candidates
    .map((item) =>
      item?.output_url ||
      item?.outputUrl ||
      item?.url ||
      item?.video_url ||
      item?.videoUrl
    )
    .find((value) => typeof value === "string" && value.length > 0) || "";

  const status =
    ["complete", "completed", "succeeded", "success", "done"].includes(rawState)
      ? "completed"
      : ["error", "failed", "cancelled", "canceled"].includes(rawState)
        ? "failed"
        : rawState || "processing";

  return {
    status,
    rawState,
    outputUrl,
    hasOutput: outputUrl.length > 0,
    malformedTerminalSuccess: status === "completed" && outputUrl.length === 0
  };
}
