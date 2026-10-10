import test from "node:test";
import assert from "node:assert/strict";
import { decideFlixlyLifecycle } from "./helpers/flixly-lifecycle-decision.mjs";

test("HTTP 202 processing keeps reservation and continues polling", () => {
  assert.deepEqual(decideFlixlyLifecycle({
    httpStatus: 202, payload: { status: "processing", id: "fixture-1" }
  }), { state: "processing", action: "continue_polling", reservation: "retain" });
});

test("completed with output persists before one-time commit", () => {
  assert.deepEqual(decideFlixlyLifecycle({
    httpStatus: 200, payload: { status: "completed", output_url: "https://fixture.invalid/out.mp4" }
  }), { state: "completed", action: "persist_then_commit_once", reservation: "retain_until_persisted_and_committed" });
});

test("completed without output is ambiguous and retains reservation", () => {
  assert.deepEqual(decideFlixlyLifecycle({
    httpStatus: 200, payload: { status: "completed" }
  }), { state: "ambiguous", action: "reconcile", reservation: "retain" });
});

test("provider-confirmed failure requests one release only after confirmation", () => {
  assert.deepEqual(decideFlixlyLifecycle({
    httpStatus: 200, payload: { status: "failed", error: { message: "fixture" } }
  }), { state: "failed", action: "release_once", reservation: "release_after_confirmed_failure" });
});

test("transport timeout is ambiguous and does not release", () => {
  assert.deepEqual(decideFlixlyLifecycle({
    transportError: true, payload: null
  }), { state: "ambiguous", action: "reconcile", reservation: "retain" });
});

test("HTTP error is unconfirmed and does not release", () => {
  assert.deepEqual(decideFlixlyLifecycle({
    httpStatus: 503, payload: { status: "failed" }
  }), { state: "ambiguous", action: "reconcile", reservation: "retain" });
});

test("unknown provider state stays processing rather than settling credits", () => {
  assert.deepEqual(decideFlixlyLifecycle({
    httpStatus: 200, payload: { status: "queued" }
  }), { state: "processing", action: "continue_polling", reservation: "retain" });
});
