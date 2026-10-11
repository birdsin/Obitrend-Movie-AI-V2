import test from "node:test";
import assert from "node:assert/strict";
import { normalizeFlixlyResponse } from "./helpers/flixly-normalize.mjs";
import { decideFlixlyLifecycle } from "./helpers/flixly-lifecycle-decision.mjs";
import { validateFlixlyMiniRequest } from "./helpers/validate-flixly-mini-request.mjs";
import { validateFlixlyStatusUrl } from "./helpers/validate-flixly-status-url.mjs";

// Review fixtures only. No network, provider, database, storage, or credit APIs.

test("completed terminal state with output is eligible for persist-then-commit decision", () => {
  const response = normalizeFlixlyResponse({
    status: "completed",
    output_url: "https://fixture.invalid/output.mp4"
  });
  assert.equal(response.status, "completed");
  assert.equal(response.hasOutput, true);
  assert.equal(decideFlixlyLifecycle({
    httpStatus: 200,
    payload: { status: "completed", output_url: response.outputUrl }
  }).action, "persist_then_commit_once");
});

test("failed terminal state is a release decision only after a successful status response", () => {
  assert.equal(decideFlixlyLifecycle({
    httpStatus: 200,
    payload: { status: "failed" }
  }).action, "release_once");
  assert.equal(decideFlixlyLifecycle({
    httpStatus: 503,
    payload: { status: "failed" }
  }).action, "reconcile");
});

test("completed state without output is never treated as success", () => {
  assert.equal(decideFlixlyLifecycle({
    httpStatus: 200,
    payload: { status: "completed" }
  }).state, "ambiguous");
});

test("request validation accepts documented minimum and maximum durations", () => {
  assert.equal(validateFlixlyMiniRequest({ duration: 4, resolution: "480p", aspectRatio: "16:9" }).valid, true);
  assert.equal(validateFlixlyMiniRequest({ duration: 15, resolution: "720p", aspectRatio: "9:16" }).valid, true);
});

test("request validation rejects durations outside documented range", () => {
  assert.equal(validateFlixlyMiniRequest({ duration: 3, resolution: "480p", aspectRatio: "16:9" }).valid, false);
  assert.equal(validateFlixlyMiniRequest({ duration: 16, resolution: "720p", aspectRatio: "9:16" }).valid, false);
});

test("status URL validation rejects insecure or deceptive hosts", () => {
  assert.equal(validateFlixlyStatusUrl("http://www.flixly.ai/api/v1/generations/x").valid, false);
  assert.equal(validateFlixlyStatusUrl("https://www.flixly.ai.attacker.invalid/x").valid, false);
});

test("status URL validation accepts only the currently documented allowlisted origin", () => {
  assert.equal(validateFlixlyStatusUrl("https://www.flixly.ai/api/v1/generations/fixture").valid, true);
});

test("normalizer handles mixed-case whitespace and nested response envelopes", () => {
  const response = normalizeFlixlyResponse({
    data: { status: "  CoMpLeTeD  ", videoUrl: "https://fixture.invalid/nested.mp4" }
  });
  assert.equal(response.status, "completed");
  assert.equal(response.rawState, "completed");
  assert.equal(response.hasOutput, true);
});

test("normalizer recognizes documented terminal aliases without output aliases being confused", () => {
  for (const status of ["complete", "completed", "succeeded", "success", "done"]) {
    assert.equal(normalizeFlixlyResponse({ status }).status, "completed", status);
  }
  for (const status of ["error", "failed", "cancelled", "canceled"]) {
    assert.equal(normalizeFlixlyResponse({ status }).status, "failed", status);
  }
  assert.equal(normalizeFlixlyResponse({ status: "future_state" }).status, "future_state");
});

test("request validation rejects fractional durations and unsupported settings", () => {
  assert.equal(validateFlixlyMiniRequest({ duration: 4.5, resolution: "480p", aspectRatio: "16:9" }).valid, false);
  assert.equal(validateFlixlyMiniRequest({ duration: 8, resolution: "1080p", aspectRatio: "16:9" }).valid, false);
  assert.equal(validateFlixlyMiniRequest({ duration: 8, resolution: "720p", aspectRatio: "2:1" }).valid, false);
});

test("request validation accepts each listed aspect ratio", () => {
  for (const aspectRatio of ["16:9", "9:16", "1:1", "21:9", "4:3", "3:4"]) {
    assert.equal(validateFlixlyMiniRequest({ duration: 8, resolution: "720p", aspectRatio }).valid, true, aspectRatio);
  }
});

test("status URL validation rejects credentials, nonstandard ports, and malformed inputs", () => {
  assert.equal(validateFlixlyStatusUrl("https://user:pass@www.flixly.ai/api/v1/generations/x").valid, false);
  assert.equal(validateFlixlyStatusUrl("https://www.flixly.ai:8443/api/v1/generations/x").valid, false);
  assert.equal(validateFlixlyStatusUrl("").valid, false);
  assert.equal(validateFlixlyStatusUrl(null).valid, false);
});
