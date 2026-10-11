/**
 * Test-only lifecycle decision model for Flixly async responses.
 * It does not call provider endpoints, storage, databases, or credit services.
 */
import { normalizeFlixlyResponse } from "./flixly-normalize.mjs";

export function decideFlixlyLifecycle({ httpStatus, payload, transportError = false }) {
  if (transportError || !Number.isInteger(httpStatus) || httpStatus < 200 || httpStatus >= 300) {
    return { state: "ambiguous", action: "reconcile", reservation: "retain" };
  }

  const normalized = normalizeFlixlyResponse(payload);
  if (normalized.status === "failed") {
    return { state: "failed", action: "release_once", reservation: "release_after_confirmed_failure" };
  }
  if (normalized.status === "completed" && normalized.hasOutput) {
    return { state: "completed", action: "persist_then_commit_once", reservation: "retain_until_persisted_and_committed" };
  }
  if (normalized.status === "completed" && !normalized.hasOutput) {
    return { state: "ambiguous", action: "reconcile", reservation: "retain" };
  }
  return { state: "processing", action: "continue_polling", reservation: "retain" };
}
