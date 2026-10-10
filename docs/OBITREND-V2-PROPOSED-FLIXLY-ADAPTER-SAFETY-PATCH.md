# OBITREND V2 — Proposed Flixly Adapter Safety Patch

**Status: PROPOSAL ONLY — NOT APPLIED TO THE SHARED SUPABASE FUNCTIONS**

Branch: `feat/obitrend-v2-structural-prototype`  
Prepared: 2026-10-11

## Safety boundary

This document proposes changes to the existing shared `ai-provider-gateway` (version 27) and `ai-job-status` (version 24), but does not change or deploy either function. No provider request, job, upload, credit mutation, or payment action was performed. V2 remains demo-only and activation remains NO-GO.

## Patch A — normalize terminal statuses

In the Flixly polling branch of `ai-job-status`, include the documented terminal spellings in the explicit aliases:

```ts
const normalizedState =
  ["complete", "completed", "succeeded", "success", "done"].includes(state)
    ? "completed"
    : ["error", "failed", "cancelled", "canceled"].includes(state)
      ? "failed"
      : state;
```

Do not report success unless a usable output has been validated and persisted. A terminal success without output should remain recoverable/ambiguous, not be reported as processing forever or settled as success.

**Test cases:** literal `completed` with each supported output alias; literal `failed`; mixed-case/whitespace states; nested provider response envelopes; terminal success without output; unknown status.

## Patch B — treat uncertain submission responses conservatively

The gateway currently attempts a credit release for any non-OK Flixly HTTP response. Replace that broad assumption only after the provider contract establishes which responses guarantee no job was accepted.

Proposed behavior:
- Confirmed provider rejection with a documented no-job-created guarantee: record failure and request an idempotent release.
- Timeout, connection loss, 5xx, malformed body, missing task ID, or any response whose acceptance semantics are unclear: preserve the reservation, mark the execution ambiguous/reconciliation-required, and do not resubmit automatically.
- Check and record every relevant RPC result. A failed release/commit/finalization must be surfaced as reconciliation-required; never claim settlement succeeded without a successful RPC result.

**Tests:** 400/401/422 only if documented as definitive rejection; 429 and 5xx ambiguity; timeout; malformed successful response; missing task ID; release/commit/finalization RPC failures; duplicate reconciliation attempts.

## Patch C — validate model settings before paid submission

For `seedance-2-mini`, the reviewed public model page lists durations 4–15 seconds, resolutions 480p/720p, and aspect ratios 16:9, 9:16, 1:1, 21:9, 4:3, 3:4. The gateway currently clamps duration to 1–30 seconds and forwards other settings.

Reject unsupported or malformed values before provider submission rather than silently changing the user's requested duration. Keep model capability rules model-specific and verify them against current official docs before applying.

**Tests:** boundaries 4 and 15; values below/above range; fractional/non-finite durations; all supported aspect ratios; unsupported ratio/resolution; unknown model; assert invalid input causes no provider call.

## Patch D — constrain image input assets

The current `startsWith("http")` check is not a sufficient security boundary. Prefer server-verified asset identifiers tied to the authenticated user and resolve them to a controlled provider-readable URL. If raw URLs remain supported, require HTTPS, validate an explicit host allowlist, reject credentials/nonstandard ports and redirects where applicable, and verify ownership/content policy server-side. Do not accept arbitrary user-supplied URLs as proof of ownership.

**Tests:** HTTP, deceptive host, credentials, nonstandard port, disallowed host, redirect to disallowed host, user-owned valid asset, another user's asset, invalid MIME/size.

## Patch E — correct model telemetry

The status function currently falls back to `seedance-2-5`, while the gateway maps the request to `seedance-2-mini`. Use the persisted selected model as the source of truth; if it cannot be established, use a neutral unknown value instead of a different model name.

**Tests:** provider response with model, without model, and with conflicting model metadata.

## Patch F — shared pure logic and failure-injection tests

The existing normalizer and lifecycle decision modules are test-only and are not imported by the deployed Edge Function. Before deployment, extract compatible pure logic into a module the actual function and tests both import, then test with mocked fetch/RPC/storage dependencies. Include duplicate polls and output-write, finalization, commit, and release failures.

A green test of a duplicate model is not evidence that the deployed function uses it. Verify that the test suite exercises the exact code shipped before any rollout.

## Required rollout gates

1. Confirm provider request/status/error schemas against current official docs or a permitted provider confirmation.
2. Establish an explicitly isolated test environment without shared user jobs, media, wallets, credits, or payment services. Do not create a Supabase project or branch without explicit authorization.
3. Review the exact source diff and tests.
4. Obtain explicit authorization for any shared function change/deployment.
5. Run isolated end-to-end tests with secrets redacted and reconcile job state, output, and credit ledger.
6. Keep a rollback plan and do not enable the catalog model until all gates pass.

## Current disposition

**NO-GO for live generation.** This is a proposed patch plan only. Shared Edge Functions, model catalog, provider settings, credentials, credits, and payment systems remain untouched.
