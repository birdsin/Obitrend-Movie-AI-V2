# OBITREND Movie AI V2 — Video Generation Enablement Gate

Status: **BLOCKED — frontend-only staging; no verified isolated backend target**

Last reviewed: 2026-10-10

## Agreed product scope

- V2 is video-generation focused.
- The current candidate is **Flixly Video**, with the planned price of **8 credits per generation**.
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

1. POST /functions/v1/ai-provider-gateway with an authenticated user's access token and JSON containing mode, model_id, prompt, settings, input_assets, and project_id.
2. For asynchronous jobs, poll GET /functions/v1/ai-job-status?job_id=....
3. Reference upload in the existing application uses POST /functions/v1/ai-media-upload.

These are source-level observations, not a successful end-to-end verification. Do not wire the V2 prototype to these routes merely because they exist in the existing app: their backend target has not been proven isolated from production.

## Blocking prerequisites before enabling real generation

- [ ] Identify and approve a non-production backend target without creating a new Supabase project/branch or incurring branch charges.
- [ ] Prove the target's database, functions, auth users, storage, provider secrets and credit ledger are isolated from production.
- [ ] Confirm the actual deployed gateway and job-status function versions and their auth/user ownership checks.
- [ ] Confirm the server-side model catalogue exposes the intended Flixly Video model and a current server-generated quote.
- [ ] Confirm the 8-credit price against the authoritative server quote; do not hardcode it as the runtime charge.
- [ ] Confirm reserve → provider execution → commit on success, and release/refund on definitive failure. Ambiguous jobs must retain their reservation until reconciled.
- [ ] Test duplicate taps, network timeouts, refreshes, unauthorized access, another user's job ID, invalid references, and provider failures using a dedicated non-production account.
- [ ] Verify that output appears only after a successful job with a valid output URL.
- [ ] Obtain explicit authorization before changing backend configuration or enabling real calls.

## Acceptance tests

- Unauthenticated and cross-user job requests are rejected server-side.
- The UI prevents duplicate submissions, while the server remains the source of truth for idempotency.
- The client cannot choose an arbitrary provider model or price.
- A failed job follows the verified server release/refund path.
- An ambiguous job is reconciled without encouraging duplicate generation.
- No output is shown or downloadable before verified success.
- No production secrets, service-role keys, live payments, or production writes are introduced into the prototype.
- Android/mobile layout remains usable.

## Next safe action

Continue read-only verification of the existing server-side function contract and cost/credit rules, then review whether a safe non-production backend target already exists. If no isolated target is available, keep generation disabled. Do not create or alter Supabase resources, connect the staging UI to a live backend, merge the draft PR, or promote the Vercel deployment to production.
## Read-only backend audit findings (2026-10-10)

- The account currently exposes two active Supabase projects: `OBITREND` (`vjlitqujcujwsislprfg`) and `OBITREND AI Platform` (`gclshpaipluhvlsznugl`). No separate V2 Supabase project is available in the project listing. No new project or branch was created.
- `OBITREND AI Platform` currently has active Edge Functions including `ai-provider-gateway` (version 27), `ai-job-status` (version 24), `credit-engine` (version 15), `ai-media-upload` (version 7), `flixly-model-sync` (version 5), and `movie-provider-usage` (version 3).
- The deployed gateway source contains Flixly, Kling, and Google Omni/Veo provider paths. This is a shared multi-provider gateway, not proof of a V2-only backend.
- The `flixly-model-sync` source fetches the live Flixly model catalog and writes to the `ai_models` table, including disabling and upserting Flixly model rows. It was inspected only; it was NOT invoked. Do not run it as a test because it mutates shared model configuration.
- The gateway/status source includes server-side credit reserve/commit/release paths and job ownership checks in the inspected status handler. These are source-level signals only; no generation, polling, upload, credit operation, provider call, or database mutation was executed during this audit.
- Since the only available AI Platform project is shared and contains active provider/payment/credit functions, its use by the V2 preview cannot currently be certified as isolated. The existing project's presence does not authorize connecting V2 to it.

### Audit decision

**Real generation remains blocked.** The safe no-new-project/no-new-branch route is to continue UI-only work and read-only verification. Do not connect the Vercel prototype to `gclshpaipluhvlsznugl`, invoke model sync, deploy or edit any Supabase function, upload references, or spend credits unless an isolated target is identified and explicitly approved.
## Additional read-only model catalogue verification (2026-10-10)

A read-only SELECT of `public.ai_models` for provider `flixly` returned a row for `flixly-video` (`Flixly Video`, category `video`, `credit_price = 8.00`) with `enabled = false`. This confirms the planned row exists in the shared AI Platform database, but it does **not** prove the upstream Flixly API currently supports that exact model or that the gateway can execute it.

The inspected `ai-provider-gateway` source maps its Flixly request payload to `seedance-2-mini` rather than using `flixly-video` as the provider model. This is a material model-ID mismatch that must be resolved and tested in an isolated environment before real generation can work safely. Do not enable the catalogue row, run model sync, or change the shared gateway as a shortcut.

The current V2 staging deployment list also shows READY staging deployments on the existing feature branch. This is not a production deployment and does not change the backend isolation decision.

### Updated next step

Prepare a proposed, review-only mapping for the V2 selection (`Flixly Video`) to the actual upstream provider model ID and server quote, without executing provider requests or mutating shared model rows. Real generation stays disabled until an isolated target and verified mapping are available.