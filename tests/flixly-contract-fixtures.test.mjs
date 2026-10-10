import test from "node:test";
import assert from "node:assert/strict";

/**
 * Mock-only contract fixtures for the Flixly response shapes currently accepted
 * by OBITREND's ai-job-status parser. This deliberately does not import or call
 * the deployed Edge Function, network, Supabase, storage, or credit APIs.
 *
 * These tests document/validate the expected contract in isolation. They do
 * NOT prove that the deployed function passes them.
 */

function normalize(payload) {
  const candidates = [payload, payload?.data, payload?.result, payload?.generation].filter(Boolean);
  const rawState = String(candidates.map((x) => x?.status).find((v) => v != null) || "")
    .trim().toLowerCase();
  const outputUrl = candidates
    .map((x) => x?.output_url || x?.outputUrl || x?.url || x?.video_url || x?.videoUrl)
    .find((v) => typeof v === "string" && v.length > 0) || "";

  const status =
    ["complete", "succeeded", "success", "done"].includes(rawState) ? "completed" :
    ["error", "cancelled", "canceled"].includes(rawState) ? "failed" :
    rawState || "processing";

  return { status, outputUrl, rawState };
}

test("completed fixture with output_url normalizes to completed", () => {
  assert.deepEqual(normalize({ status: "completed", output_url: "https://fixture.invalid/out.mp4" }), {
    status: "completed", outputUrl: "https://fixture.invalid/out.mp4", rawState: "completed"
  });
});

test("nested result with success and url normalizes", () => {
  assert.deepEqual(normalize({ result: { status: "success", url: "https://fixture.invalid/video.mp4" } }), {
    status: "completed", outputUrl: "https://fixture.invalid/video.mp4", rawState: "success"
  });
});

test("HTTP 202 processing-shaped body stays processing", () => {
  assert.deepEqual(normalize({ status: "processing", status_url: "https://fixture.invalid/status/abc", id: "fixture-task" }), {
    status: "processing", outputUrl: "", rawState: "processing"
  });
});

test("failed fixture normalizes to failed", () => {
  assert.deepEqual(normalize({ generation: { status: "failed", error: { message: "fixture failure" } } }), {
    status: "failed", outputUrl: "", rawState: "failed"
  });
});

test("legacy cancelled spelling normalizes to failed", () => {
  assert.equal(normalize({ status: "canceled" }).status, "failed");
});

test("completed without an output URL remains distinguishable as malformed", () => {
  const result = normalize({ status: "completed" });
  assert.equal(result.status, "completed");
  assert.equal(result.outputUrl, "");
  // The consumer MUST NOT mark this as successful output delivery.
  assert.equal(result.status === "completed" && !result.outputUrl, true);
});

test("missing task response does not invent an identifier", () => {
  const payload = { status: "processing", status_url: "https://fixture.invalid/status/abc" };
  assert.equal(payload.id, undefined);
  assert.equal(payload.task_id, undefined);
});

test("unknown provider state is not mistaken for success or failure", () => {
  const result = normalize({ status: "queued" });
  assert.equal(result.status, "queued");
  assert.equal(result.outputUrl, "");
});

test("fixture URLs are inert placeholders only", () => {
  const serialized = JSON.stringify([
    { status: "completed", output_url: "https://fixture.invalid/out.mp4" },
    { status: "processing", status_url: "https://fixture.invalid/status/abc" }
  ]);
  assert.equal(serialized.includes("flixly.ai"), false);
});
