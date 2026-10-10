# OBITREND V2 — Video Provider Activation Gate

**Status:** BLOCKED — audit-only; do not enable live generation  
**Scope:** Existing provider integration reviewed read-only on 2026-10-10  
**Environment:** V2 prototype remains demo-only; no shared backend changes authorized

## Verified observations

- The existing shared Supabase project has an active `ai-provider-gateway` Edge Function (version 27) and `credit-engine` (version 15).
- The gateway source includes job creation, credit reservation, provider execution claiming, provider submission/polling, output recording, and credit settlement/release paths.
- The `public.ai_models` catalogue has a `Flixly Video` video model record with provider `flixly`, `enabled = false`, and stored `credit_price = 8.00`.
- Gateway source builds a Flixly Seedance 2.0 Mini payload and clamps duration to 1–30 seconds.
- The previously reviewed public model documentation lists Seedance 2.0 Mini duration as 4–15 seconds. This mismatch must be reconciled before any request is enabled.
- Source inspection is not an end-to-end test. It does not prove provider credentials, payload compatibility, output persistence, or credit settlement work correctly.

## Required gates before activation

1. **Model contract:** Verify supported duration, resolution, aspect ratios, audio behavior, required fields, and provider error schema against current official documentation.
2. **Request contract:** Confirm mode/model ID mapping, text-to-video vs image-to-video selection, asset ownership and URL accessibility, and rejection of unsupported settings.
3. **Async lifecycle:** Verify accepted/submitted/processing/succeeded/failed/ambiguous status mapping and polling behavior, including timeouts and provider errors.
4. **Output delivery:** Verify successful output URL extraction, secure storage ownership, URL expiration, MIME type, and durable job-output persistence.
5. **Credits and idempotency:** Verify one reservation per job, duplicate submission prevention, exactly-once settlement, safe release on confirmed failure, and reconciliation on ambiguous outcomes.
6. **Isolation:** Demonstrate a dedicated test path isolated from shared/live jobs, media, wallets, credits, and payment services. Do not create a new Supabase project or branch without explicit authorization.
7. **Evidence:** Run controlled tests only after isolation and authorization are established; capture test job IDs, provider responses with secrets removed, output checks, and credit ledger reconciliation.

## No-go conditions

- Do not set the shared Flixly model to enabled.
- Do not call `flixly-model-sync`.
- Do not submit provider jobs, upload media, poll live jobs, or exercise live credit/payment actions as an exploratory test.
- Do not change shared Edge Functions, model catalogue rows, database schema, secrets, or production configuration.
- Do not connect the V2 prototype to the shared gateway yet.
- Do not describe the 8-credit catalogue value as a verified live price.
- Do not claim end-to-end generation has passed until all gates above have evidence.

## Safe next action

Obtain and review current official provider API documentation and prepare a non-executing contract test plan. Keep the V2 UI demo-only until isolation and all activation gates are proven.

## Additional Flixly contract review (2026-10-10)

Official references reviewed:
- https://www.flixly.ai/developers
- https://www.flixly.ai/models/seedance-2-mini

The provider docs say asynchronous video requests can return HTTP 202 with `status: "processing"`; the client should poll `status_url` until completion or failure. Seedance 2.0 Mini lists 480p/720p, ratios 16:9, 9:16, 1:1, 21:9, 4:3, 3:4, and durations 4–15 seconds.

Read-only gateway source review found:
- The Flixly payload builder clamps duration to 1–30 seconds, which does not match the documented 4–15 second range.
- The submission path accepts task IDs and returns `processing` for non-completed responses.
- A Flixly-specific polling path for the documented `status_url` was not identified in the reviewed gateway source. This must be resolved before activation.
- Resolution and aspect ratio should be validated against the model's supported values rather than forwarded without validation.

These findings are source/documentation observations, not a live integration test. No provider request was sent. Keep generation disabled until duration validation, async polling, output persistence, and credit settlement/release have been verified in an explicitly isolated test environment.


## Follow-up read-only status-function audit and mock-only test plan (2026-10-10)

A read-only inspection of the existing shared `ai-job-status` Edge Function (version 24) found a Flixly-specific status branch. For a job whose execution provider is `flixly` and whose `provider_job_id` is present, it calls:

`GET https://www.flixly.ai/api/v1/generations/{provider_job_id}`

with a server-side Bearer key, then normalizes several response shapes and maps completed/failed/other states. Therefore, the earlier statement that no Flixly-specific polling branch was identified is superseded: **a polling branch exists**. However, the inspected code polls the generation-ID endpoint; it does not visibly follow a provider-returned `status_url`. Confirm whether this endpoint is the documented supported equivalent and whether its response schema matches the parser before activation.

Additional source-level items to verify (no requests or writes performed):
- The parser recognizes several state/output aliases but should be checked against actual documented response envelopes and terminal status values.
- If completion arrives without an output URL, the branch falls through to `processing`; decide how malformed terminal responses should be surfaced without incorrectly releasing reserved credits.
- The fallback recorded model label is `seedance-2-5`, although the gateway payload builder reviewed earlier selects `seedance-2-mini`. Verify this telemetry label before relying on model-level cost reports.
- Output is recorded as a provider URL; confirm retention, access control, expiry, and storage requirements before product launch.
- The branch includes credit commit/release and cost-recording calls. Their behavior must be tested with isolated fixtures/mocks, not against shared user jobs.

### Non-executing contract fixture matrix

Use unit tests with mocked fetch responses and mocked database/RPC/storage calls only. Tests must not use live credentials, real provider endpoints, shared user/job IDs, or shared credit ledgers.

| Fixture | Expected contract assertion |
|---|---|
| HTTP 200, completed + output URL | Normalize to success; write output; only then settle mocked reservation once |
| HTTP 202, processing + task ID | Return processing; keep mocked reservation reserved |
| HTTP 202, processing + status_url | Confirm whether status_url must be followed; do not silently assume generation-ID polling is equivalent |
| Completed but missing output URL | Never report success; retain reservation and surface an explicit ambiguous/contract-error state |
| Failed terminal response | Mark failure and request one idempotent mock release |
| Network timeout / non-OK status | Treat status as unconfirmed; do not release reservation based only on uncertainty |
| Missing provider task ID | Do not poll an empty/invalid identifier; surface submission ambiguity for reconciliation |
| Output persistence failure | Do not report success or commit mocked credits; preserve reconciliation state |
| Execution finalization failure | Preserve ambiguous state; prevent duplicate settlement |
| Credit commit/release RPC failure | Report reconciliation-required; do not claim the ledger is settled |
| Duplicate status poll | Assert idempotent output/settlement behavior |
| Unsupported duration/resolution/ratio | Reject before provider submission once model contract validation is implemented |

This matrix is a proposed test plan, not evidence that tests have run or passed.

## Current disposition

The status-function audit narrows one uncertainty: Flixly polling code exists. It does **not** clear activation. Duration validation remains mismatched; use of `status_url` remains unconfirmed; response/output handling, storage policy, idempotency, and credit settlement remain untested end-to-end. Keep the V2 prototype demo-only and retain all no-go conditions above.


## Mock fixture harness status (2026-10-10)

Added `tests/flixly-contract-fixtures.test.mjs` on the prototype branch. A local Node test run of this standalone fixture harness passed **9/9 assertions** (0 failed). Coverage includes completed output aliases, nested response shape, processing, failed/cancelled states, completed-without-output detection, missing identifiers, unknown states, and inert fixture URLs.

**Important limitation:** this is a standalone contract fixture that mirrors the currently reviewed parser's normalization behavior. It does not import or execute the deployed `ai-job-status` function and does not test Supabase RPCs, provider network calls, storage, or credit settlement. The passing result is not production integration evidence and does not clear any activation gate.

Next testing improvement, still mock-only: extract the normalization logic into a shared pure module that the status function and tests both import, then add mocked lifecycle assertions for output-write/finalization/credit-RPC failures and duplicate polls. Do not deploy or modify the shared function as part of this step.


## Shared pure normalizer and expanded mock lifecycle fixtures (2026-10-10)

Added `tests/helpers/flixly-normalize.mjs` and updated `tests/flixly-contract-fixtures.test.mjs` to import it. The pure helper has no network, database, storage, environment, or credit side effects. The fixture suite now also covers mocked output-write failure, credit-commit failure, provider timeout, duplicate-poll idempotency, and idempotent failure release.

A local Node.js run of an equivalent isolated mock harness passed **14/14 assertions**. Network access to retrieve the committed files into the local runner was unavailable, so this run should not be described as CI execution of the committed repository file. The committed test suite itself has not been run by CI in this step.

**Integration boundary:** The new helper is currently test-scoped. It has not been wired into the existing deployed `ai-job-status` function. Doing so would require a reviewed code change and a safe deployment plan; the shared function was intentionally left untouched. The mock lifecycle tests validate expected invariants only; they do not prove database RPC idempotency or live credit-ledger behavior.


## CI workflow added for mock-only Flixly contract tests (2026-10-10)

Added `.github/workflows/flixly-contract-tests.yml` on the prototype branch. It uses Node.js 22 and runs `node --test tests/flixly-contract-fixtures.test.mjs` for relevant pushes, pull requests targeting `main`, or manual dispatch. Permissions are limited to `contents: read`; no provider credentials or service calls are required.

The workflow was added in commit `39a23eea346bb6098c3cf7fa5d68602a7262cfc7`. At the time of this check, no associated pull-request workflow run was returned by the available run lookup. **CI execution is now verified:** GitHub Actions run [38090518445](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38090518445) completed successfully, and the `Mock-only Flixly contract fixtures` job's test step passed. This confirms only the isolated mock fixture suite, not live provider integration.

This CI workflow only runs the mock fixture suite. It does not test or deploy the shared Supabase function and does not clear any video-provider activation gate.


## Documented request-settings preflight fixtures added (2026-10-10)

Added a pure test-only validator at `tests/helpers/validate-flixly-mini-request.mjs` and eight test cases at `tests/flixly-mini-request-validation.test.mjs`. The fixtures cover the documented Seedance 2.0 Mini duration range (4–15 seconds), resolutions (480p/720p), and aspect ratios (16:9, 9:16, 1:1, 21:9, 4:3, 3:4), including invalid, fractional, and unsupported settings. The GitHub Actions workflow was updated to run both the existing response/lifecycle mock suite and this request-settings suite.

**Status at this commit:** the tests and workflow have been committed, but the new CI run has not yet been checked. These are isolated pure-function fixtures only; the validator is not wired into the shared gateway, no provider request is sent, and no activation gate is cleared. Confirm the CI run result before describing these new tests as passing.


## Request-settings CI verification and status-URL safety fixtures (2026-10-10)

The combined CI run [38090969977](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38090969977) completed successfully. Its Node test step passed after the documented request-settings preflight tests were added. This verifies the fixture suite at that commit only.

A further test-only safety layer has now been added:
- `tests/helpers/validate-flixly-status-url.mjs` accepts only HTTPS URLs whose origin exactly matches the current allowlist (`https://www.flixly.ai`), and rejects malformed URLs, HTTP, deceptive hosts/subdomains, nonstandard ports, embedded credentials, and relative URLs.
- `tests/flixly-status-url-validation.test.mjs` covers these URL-policy cases.
- The workflow was updated to run this new test file as well. **CI verification for this addition passed:** run [38091915529](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38091915529) completed successfully, including the test step for the combined mock suites.

This helper only validates a candidate URL; it does not fetch it, does not prove the provider requires `status_url`, and is not wired into the shared function. The exact allowlisted origin must be checked against current provider documentation before any production use. No provider request or shared backend operation was performed.
