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
  assert.equal(validateFlixlyMiniRequest({ duration: 4, resolution: "480p", aspect_ratio: "16:9" }).valid, true);
  assert.equal(validateFlixlyMiniRequest({ duration: 15, resolution: "720p", aspect_ratio: "9:16" }).valid, true);
});

test("request validation rejects durations outside documented range", () => {
  assert.equal(validateFlixlyMiniRequest({ duration: 3, resolution: "480p", aspect_ratio: "16:9" }).valid, false);
  assert.equal(validateFlixlyMiniRequest({ duration: 16, resolution: "720p", aspect_ratio: "9:16" }).valid, false);
});

test("status URL validation rejects insecure or deceptive hosts", () => {
  assert.equal(validateFlixlyStatusUrl("http://www.flixly.ai/api/v1/generations/x").valid, false);
  assert.equal(validateFlixlyStatusUrl("https://www.flixly.ai.attacker.invalid/x").valid, false);
});

test("status URL validation accepts only the currently documented allowlisted origin", () => {
  assert.equal(validateFlixlyStatusUrl("https://www.flixly.ai/api/v1/generations/fixture").valid, true);
});
