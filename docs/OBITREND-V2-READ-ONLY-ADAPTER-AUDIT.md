# OBITREND V2 — Read-Only Adapter Audit

Date: 2026-10-10
Branch: `feat/obitrend-v2-structural-prototype`
Status: **SOURCE REVIEW ONLY — NO PROVIDER CALLS OR BACKEND CHANGES**

## Scope

Reviewed the currently deployed source text for the shared Supabase AI Platform Edge Functions:
- `ai-provider-gateway` (version 27)
- `ai-job-status` (version 24)
- `credit-engine` (version 15)

This is source inspection only. No function was invoked to create a job, upload media, call Flixly, poll a live job, or mutate credit state. Function versions and source observed do not prove a successful end-to-end generation.

## Observed Flixly gateway behavior

- Gateway accepts `mode`, `model_id`, prompt/settings, and input asset data, then creates/reserves a job through database RPCs before dispatching by provider.
- Flixly branch reads `FLIXLY_API_KEY` server-side and posts to `https://www.flixly.ai/api/v1/generate`.
- The payload mapper selects upstream model `seedance-2-mini`, infers text-to-video vs image-to-video from mode/assets, clamps duration to 1–30 seconds, and forwards aspect ratio/resolution settings.
- Network ambiguity retains the reservation; a definitive HTTP/provider failure attempts to release credits.
- A synchronous completed response with output URL attempts to write output and commit credits; a task ID response is recorded and returned as processing.
- Several RPC results around settlement/recording are not all checked uniformly. This deserves a dedicated failure-path review before any integration test.

## Observed status behavior

- `ai-job-status` authenticates the caller, fetches the job constrained by both job ID and user ID, and fetches the provider execution constrained by job ID and user ID.
- A Flixly polling branch exists and calls `GET https://www.flixly.ai/api/v1/generations/{id}` for submitted jobs.
- The source includes output handling and settlement logic, but this inspection does not prove all status transitions, output storage, signed URL handling, and settlement cases are correct under live provider responses.
- The status function's Flixly success path uses `seedance-2-5` as a fallback model label when the provider response contains no model identifier. That fallback can mislabel a `seedance-2-mini` job and should be replaced by the persisted selected model or a neutral unknown value.

## Follow-up comparison with current official Flixly docs

Official references checked on 2026-10-10:
- https://www.flixly.ai/developers
- https://www.flixly.ai/models/seedance-2-mini
- https://www.flixly.ai/api-docs

The official developer docs describe `POST /api/v1/generate`, asynchronous video responses, and `GET /api/v1/generations/{id}`. The Seedance 2.0 Mini model page lists durations from 4 through 15 seconds, resolutions 480p/720p, and supported aspect ratios 16:9, 9:16, 1:1, 21:9, 4:3, and 3:4.

### Confirmed source-to-doc mismatches or unresolved assumptions

1. **Duration validation mismatch.** The gateway clamps the selected duration to 1–30 seconds. For `seedance-2-mini`, reject unsupported durations and accept only model-supported values (4–15 seconds according to the current model page). Do not silently clamp because it can generate a different duration than the user selected. Use model-specific capabilities rather than one global range.
2. **Request type and image field need verification.** The mapper sends `type: TEXT_TO_VIDEO` or `IMAGE_TO_VIDEO` and optionally `image_url`. The public model page confirms text/image-to-video capabilities, but this source review has not established that every submitted field, combination, and image URL format matches the current authenticated Flixly schema.
3. **Response schema assumptions.** The gateway accepts task identifiers from `id`, `task_id`, or `generation_id`, and recognizes only selected status/output aliases. The public docs show examples but do not prove all live response envelopes or terminal status spellings. Confirm the exact response schema before enabling.
4. **Polling contract.** The status function calls the documented generation endpoint but interprets response envelopes and status values locally. Verify exact terminal states, nested output fields, and error shape against the current API contract and a permitted isolated test.
5. **Incorrect fallback model label.** The status function can label a successful result `seedance-2-5` when no model is returned, despite the selected adapter model being `seedance-2-mini`. Persist the selected model and use it as the source of truth; otherwise use `unknown`, not a different model.
6. **Asset ownership and access.** V2 currently has a local browser preview, not a validated server-owned asset ID or controlled provider-readable HTTPS URL. Do not pass arbitrary URLs through to the provider; validate scheme, ownership, file type, size, and allowed storage host.
7. **Settlement failures.** Audit every RPC result for reservation, execution state changes, output persistence, commit, and release. Any failure after a provider may have accepted a request must remain recoverable and idempotent; do not silently release or charge twice.
8. **Output trust and retention.** Validate provider output URLs and content type, ownership, retention, safe storage, and signed-download behavior before Save/Download is enabled.
9. **Pricing is unconfirmed.** A catalog value or prior example is not an authoritative customer quote. Require a current server-issued quote and approved pricing policy before presenting a credit cost or submitting a paid generation.
10. **Shared environment.** The functions belong to the shared AI Platform. This review has not proven isolation of users, wallets, provider credentials, storage, job records, or billing from production.

## Required safe next step

Continue read-only source review and contract documentation. If an isolated non-production environment is not already available and proven, stop and request explicit authorization before any backend or provider test. Do not create another Supabase project/branch.

## Decision

**NO-GO for connecting OBITREND V2 to the shared gateway or enabling real generation.**

Allowed: review-only documentation and UI-only prototype changes that remain clearly in demo mode.

Not performed: provider calls, live jobs, uploads, credit/payment operations, database mutations, Edge Function deployments, PR merge, or production deployment.
