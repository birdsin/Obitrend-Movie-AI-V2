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

## Observed credit function behavior

- `credit-engine` validates an authenticated user and accepts reserve, commit, or release actions by job ID through `process_credit_action`.
- This is shared credit infrastructure. Its existence is not evidence that V2 has a separate wallet, database, project, or safe test tenancy.

## Risks and unresolved verification

1. **Isolation not established.** These functions are in the shared AI Platform. Do not connect V2 to them until separate test identities, data, provider credentials, wallets, storage and job records are proven isolated from production.
2. **Provider contract not end-to-end verified.** The adapter assumes specific payload and response fields. Compare these with current official Flixly docs and a sanctioned non-production test before enabling.
3. **Input asset contract unclear for V2.** The prototype currently only previews a local reference file. Local browser files are not uploaded assets or server-owned asset IDs.
4. **Idempotency and retries need proof.** Verify duplicate submissions, lost responses, repeated polls, stale task IDs, and reconciliation after a provider accepted a request but the client/server timed out.
5. **Settlement failure paths need focused review.** Check all RPC errors for reserve, provider execution updates, output writes, release and commit; ensure failures cannot silently leave jobs or balances inconsistent.
6. **Output trust and persistence need proof.** Validate provider output URL/type, ownership, retention, safe storage and signed-download behavior before enabling Save/Download.
7. **Price is not authoritative.** Do not expose the proposed 8-credit cost as a confirmed price without a current server-issued quote and approved pricing policy.
8. **Security configuration needs review.** Verify authorization, model allowlist, input size/type/ownership, project ownership, server-side secrets, CORS policy, rate limits, and that provider errors/logs do not leak secrets or sensitive data.

## Required safe next step

Continue read-only source review and compare request/response mapping to official provider docs. If an isolated non-production environment is not already available and proven, stop and request explicit authorization before any backend or provider test. Do not create another Supabase project/branch.

## Decision

**NO-GO for connecting OBITREND V2 to the shared gateway or enabling real generation.**

Allowed: review-only documentation and UI-only prototype changes that remain clearly in demo mode.
Not performed: provider calls, live jobs, uploads, credit/payment operations, database mutations, Edge Function deployments, PR merge, or production deployment.
