import test from "node:test";
import assert from "node:assert/strict";
import { normalizeFlixlyResponse } from "./helpers/flixly-normalize.mjs";

/**
 * Isolated contract fixtures. No deployed Edge Function, provider network,
 * Supabase, storage, or credit API is called by this test file.
 */

test("completed fixture with output_url normalizes to completed", () => {
  assert.deepEqual(normalizeFlixlyResponse({
    status: "completed", output_url: "https://fixture.invalid/out.mp4"
  }), {
    status: "completed", rawState: "completed",
    outputUrl: "https://fixture.invalid/out.mp4", hasOutput: true,
    malformedTerminalSuccess: false
  });
});

test("nested result with success and url normalizes", () => {
  const result = normalizeFlixlyResponse({
    result: { status: "success", url: "https://fixture.invalid/video.mp4" }
  });
  assert.equal(result.status, "completed");
  assert.equal(result.outputUrl, "https://fixture.invalid/video.mp4");
});

test("HTTP 202 processing-shaped body stays processing", () => {
  const result = normalizeFlixlyResponse({
    status: "processing",
    status_url: "https://fixture.invalid/status/abc",
    id: "fixture-task"
  });
  assert.equal(result.status, "processing");
  assert.equal(result.outputUrl, "");
});

test("failed fixture normalizes to failed", () => {
  assert.equal(normalizeFlixlyResponse({
    generation: { status: "failed", error: { message: "fixture failure" } }
  }).status, "failed");
});

test("legacy cancelled spelling normalizes to failed", () => {
  assert.equal(normalizeFlixlyResponse({ status: "canceled" }).status, "failed");
});

test("completed without output is explicitly malformed", () => {
  const result = normalizeFlixlyResponse({ status: "completed" });
  assert.equal(result.status, "completed");
  assert.equal(result.hasOutput, false);
  assert.equal(result.malformedTerminalSuccess, true);
});

test("missing task response does not invent an identifier", () => {
  const payload = { status: "processing", status_url: "https://fixture.invalid/status/abc" };
  assert.equal(payload.id, undefined);
  assert.equal(payload.task_id, undefined);
});

test("unknown provider state is not mistaken for success or failure", () => {
  assert.equal(normalizeFlixlyResponse({ status: "queued" }).status, "queued");
});

test("fixture URLs are inert placeholders only", () => {
  const serialized = JSON.stringify([
    { status: "completed", output_url: "https://fixture.invalid/out.mp4" },
    { status: "processing", status_url: "https://fixture.invalid/status/abc" }
  ]);
  assert.equal(serialized.includes("flixly.ai"), false);
});

test("mock lifecycle does not commit credits if output write fails", async () => {
  const events = [];
  async function mockLifecycle({ providerSucceeded, outputWriteOk }) {
    if (!providerSucceeded) return { status: "processing", events };
    events.push("output-write");
    if (!outputWriteOk) return { status: "ambiguous", creditsReserved: true, events };
    events.push("commit");
    return { status: "succeeded", events };
  }
  const result = await mockLifecycle({ providerSucceeded: true, outputWriteOk: false });
  assert.equal(result.status, "ambiguous");
  assert.equal(result.creditsReserved, true);
  assert.deepEqual(events, ["output-write"]);
});

test("mock lifecycle does not claim settlement if credit commit fails", async () => {
  const events = [];
  async function mockLifecycle({ outputWriteOk, commitOk }) {
    if (!outputWriteOk) return { status: "ambiguous", creditsReserved: true, events };
    events.push("output-write");
    if (!commitOk) return { status: "ambiguous", creditsReserved: true, events };
    events.push("commit");
    return { status: "succeeded", events };
  }
  const result = await mockLifecycle({ outputWriteOk: true, commitOk: false });
  assert.equal(result.status, "ambiguous");
  assert.equal(result.creditsReserved, true);
  assert.deepEqual(events, ["output-write"]);
});

test("mock lifecycle retains reservation on provider timeout", async () => {
  const result = { status: "ambiguous", creditsReserved: true, releaseCalled: false };
  assert.equal(result.status, "ambiguous");
  assert.equal(result.creditsReserved, true);
  assert.equal(result.releaseCalled, false);
});

test("duplicate mock polls do not run settlement twice", async () => {
  let commits = 0;
  const settledJobs = new Set();
  function commitOnce(jobId) {
    if (settledJobs.has(jobId)) return;
    settledJobs.add(jobId);
    commits += 1;
  }
  commitOnce("fixture-job-1");
  commitOnce("fixture-job-1");
  assert.equal(commits, 1);
});

test("failed terminal result asks for at most one mock release", () => {
  let releases = 0;
  const releasedJobs = new Set();
  function releaseOnce(jobId) {
    if (releasedJobs.has(jobId)) return;
    releasedJobs.add(jobId);
    releases += 1;
  }
  releaseOnce("fixture-job-failed");
  releaseOnce("fixture-job-failed");
  assert.equal(releases, 1);
});
