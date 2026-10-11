# Proposed Flixly status-normalizer integration patch

**Status:** REVIEW PROPOSAL ONLY — not deployed and not wired into the shared Supabase function  
**Target:** Existing shared `ai-job-status` Flixly branch, currently reported as version 24  
**Safety boundary:** No live provider calls, database writes, credit operations, storage operations, or deployments were performed for this proposal.

## Why this patch is not applied to the deployed function

The pure helper currently lives in the OBITREND V2 prototype repository at `tests/helpers/flixly-normalize.mjs`. The deployed Supabase Edge Function is a separate artifact. Importing a test file from this repository into that function would not work without copying/restructuring the module in the function's own source bundle and reviewing the deployed artifact. Automatically deploying a replacement to the shared project would cross the user's explicit safety boundary.

## Proposed code change

In the isolated function source bundle, place the pure helper at a function-local module path such as `_shared/flixly-normalize.ts`, using the same normalization behavior as the reviewed helper:

- inspect the documented response envelopes;
- normalize terminal states only from provider-confirmed values;
- return output URL and a separate malformed-terminal-success flag;
- keep this module free of network, database, storage, environment, and credit side effects.

The Flixly status branch should then call the helper after parsing JSON. Its lifecycle should use explicit branches:

1. **Processing / non-terminal:** return processing and leave the reservation unchanged.
2. **Completed with valid output URL:** record output, finalize execution, then request the existing idempotent credit commit; if any persistence/finalization/commit step fails, return reconciliation-required and preserve the reservation.
3. **Completed without output URL:** return an explicit ambiguous/contract-error state; do not report success or release credits.
4. **Provider-confirmed failed:** mark failure and request the existing idempotent release; if release fails, report reconciliation-required.
5. **Timeout / non-OK / malformed response:** report unconfirmed/ambiguous; do not release credits based on uncertainty.
6. **Duplicate poll:** rely on verified database/RPC idempotency and terminal-state guards, not only an in-memory test set.

## Status URL compatibility gate

The reviewed code polls `GET /api/v1/generations/{provider_job_id}`. Before changing this behavior, confirm from current official Flixly docs whether that endpoint is the supported status endpoint and whether the `status_url` in an HTTP 202 response must be followed. Do not blindly fetch a URL supplied by an upstream response: if `status_url` is supported, validate HTTPS and the exact permitted Flixly host before using it to avoid server-side request forgery.

## Tests required before any deployment

- Run the committed Node test file in CI.
- Test the exact helper imported by the isolated function bundle.
- Add mocked fetch, database RPC, output persistence, and settlement tests for success, processing, provider failure, missing output, timeout, non-OK, duplicate polls, output write failure, execution finalization failure, and credit commit/release failure.
- Test allowed duration/resolution/aspect ratio validation before provider submission.
- Verify cost telemetry model ID matches the submitted model.
- Confirm no test uses real credentials, live endpoints, shared job IDs, real storage, or live credit ledgers.
- Review a diff of the isolated function bundle before any deployment decision.

## Acceptance checklist

- [ ] Official Flixly status endpoint and response schema verified.
- [ ] Duration range and supported settings validated before submission.
- [ ] Normalizer helper imported by the isolated function bundle.
- [ ] Unit tests run by CI against the same helper used by the function.
- [ ] Lifecycle tests prove reservation remains protected on ambiguous outcomes.
- [ ] Exactly-once commit/release behavior verified through isolated database tests.
- [ ] Output retention/access-control policy approved.
- [ ] Explicit authorization obtained before changing or deploying the shared function.

Until all boxes are checked, keep the model disabled and OBITREND V2 demo-only. This proposal does not claim the integration is implemented or that any live test has passed.
