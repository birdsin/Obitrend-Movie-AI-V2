import test from "node:test";
import assert from "node:assert/strict";
import { validateFlixlyStatusUrl } from "./helpers/validate-flixly-status-url.mjs";

test("accepts HTTPS URL on exact allowlisted Flixly origin", () => {
  assert.equal(validateFlixlyStatusUrl("https://www.flixly.ai/api/v1/generations/fixture-id").valid, true);
});

test("rejects missing and malformed URLs", () => {
  assert.equal(validateFlixlyStatusUrl("").valid, false);
  assert.equal(validateFlixlyStatusUrl("not a URL").valid, false);
});

test("rejects plain HTTP", () => {
  assert.equal(validateFlixlyStatusUrl("http://www.flixly.ai/api/v1/generations/x").reason, "https_required");
});

test("rejects deceptive subdomains and suffix hosts", () => {
  assert.equal(validateFlixlyStatusUrl("https://flixly.ai.attacker.invalid/status").valid, false);
  assert.equal(validateFlixlyStatusUrl("https://attacker.flixly.ai/status").valid, false);
});

test("rejects unapproved origin and port", () => {
  assert.equal(validateFlixlyStatusUrl("https://api.flixly.ai/status").valid, false);
  assert.equal(validateFlixlyStatusUrl("https://www.flixly.ai:8443/status").valid, false);
});

test("rejects embedded URL credentials", () => {
  assert.equal(validateFlixlyStatusUrl("https://user:pass@www.flixly.ai/status").valid, false);
});

test("never resolves relative URLs against an implicit base", () => {
  assert.equal(validateFlixlyStatusUrl("/api/v1/generations/x").valid, false);
});
