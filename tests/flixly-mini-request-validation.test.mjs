import test from "node:test";
import assert from "node:assert/strict";
import { validateFlixlyMiniRequest } from "./helpers/validate-flixly-mini-request.mjs";

const valid = { duration: 5, resolution: "480p", aspectRatio: "16:9" };

test("accepts documented minimum duration and supported settings", () => {
  assert.deepEqual(validateFlixlyMiniRequest({ ...valid, duration: 4 }), { valid: true, errors: [] });
});

test("accepts documented maximum duration and supported settings", () => {
  assert.deepEqual(validateFlixlyMiniRequest({ ...valid, duration: 15, resolution: "720p", aspectRatio: "3:4" }), { valid: true, errors: [] });
});

test("rejects duration below documented range", () => {
  assert.equal(validateFlixlyMiniRequest({ ...valid, duration: 3 }).valid, false);
});

test("rejects duration above documented range", () => {
  assert.equal(validateFlixlyMiniRequest({ ...valid, duration: 16 }).valid, false);
});

test("rejects fractional or string duration", () => {
  assert.equal(validateFlixlyMiniRequest({ ...valid, duration: 4.5 }).valid, false);
  assert.equal(validateFlixlyMiniRequest({ ...valid, duration: "5" }).valid, false);
});

test("rejects unsupported resolution", () => {
  assert.equal(validateFlixlyMiniRequest({ ...valid, resolution: "1080p" }).valid, false);
});

test("rejects unsupported aspect ratio", () => {
  assert.equal(validateFlixlyMiniRequest({ ...valid, aspectRatio: "5:4" }).valid, false);
});

test("reports every invalid setting without side effects", () => {
  const result = validateFlixlyMiniRequest({ duration: 30, resolution: "4k", aspectRatio: "2:1" });
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 3);
});
