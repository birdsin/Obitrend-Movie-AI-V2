# OBITREND Movie AI V2 — Video Generation Enablement Gate

Status: **BLOCKED — frontend-only staging; no verified isolated backend target**

Last reviewed: 2026-10-10

## Agreed product scope

- V2 is video-generation focused.
- The current candidate is **Flixly Video**, with a planned price of **8 credits per generation**.
- Treat that price as a product-plan value only until the server returns a current, verified model/quote. The browser must never decide or deduct credits.
- Do not list Kling, Veo, Runway, image-generation, or other providers as available in V2 unless the product owner explicitly changes scope and the provider is verified.

## Current staging behavior

- The Vercel deployment serves a standalone structural prototype.
- Prompt and local reference-file checks happen in the browser.
- Reference images/videos are not uploaded.
- Generate only performs local validation; it does not call an AI endpoint.
- No model is represented as verified/connected.
- Output actions stay disabled until an actual successful job returns a validated output asset.
- No real credits, project data, storage, payments, or account data are connected.

## Source contract observed (read-only)

The existing application source uses these routes in its video-generation flow:

1. POST `/functions/v1/ai-provider-gateway` with an authenticated user's access token and JSON containing `mode`, `model_id`, `prompt`, `settings`, `input_assets`, and `project_id`.
2. For asynchronous jobs, poll GET `/functions/v1/ai-job-status?job_id=...`.
3. Reference upload in the existing application uses POST `/functions/v1/ai-media-upload`.

These are source-level observations, not a successful end-to-end verification. Do not wire the V2 prototype to these routes merely because they exist in the existing app: their backend target has not been proven isolated from production.

## Blocking prerequisites before enabling real generation

- [ ] Identify and approve a non-production backend target without creating a new Supabase project/branch or incurring branch charges.
- [ ] Prove the target's database, functions, auth users, storage, provider secrets and credit ledger are isolated from production.
- [ ] Confirm the actual deployed gateway and job-status function versions and their auth/user ownership checks.
- [ ] Confirm the server-side model catalogue exposes the intended Flixly Video model and a current server-generated quote.
- [ ] Confirm the 8-credit price against the authoritative server quote; do not hard-code it as a guaranteed cost.
- [ ] Confirm the exact upstream model ID and persist it with each job.
- [ ] Confirm request/response fields, asynchronous status values, task ID, output URL, and error envelope against current official Flixly API documentation.
- [ ] Verify duration, resolution and aspect ratio against the selected model's capabilities. The public Seedance 2.0 Mini page lists 4–15 seconds, 480p/720p and aspect ratios 16:9, 9:16, 1:1, 21:9, 4:3 and 3:4. Reject unsupported inputs; never silently clamp the requested duration. See https://www.flixly.ai/models/seedance-2-mini.
- [ ] Fix the shared status handler's fallback model label: it must not label a Seedance 2.0 Mini job as Seedance 2.5 when the provider response omits a model. Use the persisted selected model or an explicit unknown value.
- [ ] Validate that image/video references are authenticated, uploaded server-owned assets. Local browser previews are not provider-ready assets.
- [ ] Validate asset ownership, MIME/type, size, count, URL scheme and allowed storage host. Do not forward arbitrary user-supplied URLs to a provider.
- [ ] Verify duplicate-submission idempotency, timeouts after provider acceptance, polling retries and stale task IDs.
- [ ] Check every reserve, execution-update, output-write, commit and release RPC result. Ensure failed settlement remains recoverable and cannot double-charge or silently lose a reservation.
- [ ] Validate output URL/type, user ownership, safe storage, retention and signed-download access before enabling Save/Download.
- [ ] Confirm provider keys remain server-side and error messages/logs cannot expose secrets.
- [ ] Obtain explicit authorization before any provider request, media upload, live job, credit action, backend change or deployment.

## Required acceptance evidence

For each supported mode/model, record the model ID and capability snapshot date, sanitized request shape, provider response/status fields, job lifecycle and polling result, output validation, authorized download, and before/after credit ledger entries.

Test at least: unsupported duration, malformed/oversized asset, cross-user access denial, duplicate submit, provider validation failure, provider timeout after possible acceptance, polling error, output-write failure, commit failure and release failure. Do not place API keys, bearer tokens, signed URLs or sensitive media in the evidence.

## Release decision

**NO-GO for real generation from OBITREND V2.**

The V2 page remains a structural prototype. Public documentation and source inspection do not prove end-to-end generation. Keep Generate controls in honest demo mode until the blocking prerequisites have been satisfied with evidence from an authorized isolated test.

No live provider calls, jobs, uploads, credit/payment actions, database mutations, Edge Function deployments, production deployments or PR merges were performed as part of this review. Do not create a new Supabase project or branch as part of this gate.
