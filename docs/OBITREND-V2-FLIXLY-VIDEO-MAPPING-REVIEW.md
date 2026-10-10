# OBITREND Movie AI V2 — Flixly Video Mapping Review

Status: **REVIEW ONLY — DO NOT ENABLE GENERATION**
Date: 2026-10-10

## Intended V2 selection

- UI label: `Flixly Video`
- Internal catalogue slug: `flixly-video`
- Catalogue category: `video`
- Current shared catalogue row: `enabled = false`
- Catalogue credit_price: `8.00` (not a verified live quote; do not treat as authorization to charge 8 credits)

## Existing gateway finding

The current shared `ai-provider-gateway` source's Flixly mapping uses the upstream model identifier `seedance-2-mini`. The catalogue slug `flixly-video` is an application-level identifier and must not automatically be forwarded as the provider model ID.

## Required mapping contract

Before implementation, obtain a verified provider contract and record:

| Field | Required verification |
| --- | --- |
| Catalogue row | `flixly-video`, category `video`, intentionally enabled only after approval |
| Upstream provider model ID | Exact model ID accepted by the current Flixly API for the intended product |
| Input support | Prompt-only and image/video reference capabilities, supported MIME types and size limits |
| Duration | Supported durations and whether the provider accepts 5, 10, or 15 seconds |
| Aspect ratio | Supported ratios and exact provider parameter names |
| Pricing | Current server-side quote / authoritative credit calculation |
| Async lifecycle | Submit response, provider job ID, polling/status mapping, output asset format |
| Failures | Definitive failure vs ambiguous timeout and credit release/reconciliation behavior |

## Non-negotiable safety rules

1. Do not infer that `seedance-2-mini` is the correct upstream model merely because it appears in the gateway source.
2. Do not call the provider, trigger `flixly-model-sync`, change the shared gateway, enable the catalogue row, upload user media, or perform credit operations as a mapping test.
3. Never trust a browser-provided price or model ID for billing. The server must validate the approved model and quote and reserve credits atomically/idempotently.
4. Only show downloadable output after the authenticated job status confirms success and a valid output asset is available.
5. Test only with an explicitly approved isolated backend and dedicated test account.

## Go / no-go

**NO-GO for live generation today.** A read-only catalogue row exists, but it is disabled; the upstream mapping is not verified; and the existing Supabase project is shared rather than a proven isolated V2 backend.

## Next review step

Obtain provider documentation or a verified, non-mutating model catalog response to establish the exact upstream model ID and parameter contract. Then prepare a code change for review on the V2 feature branch only. Do not deploy backend changes or enable generation until the isolation gate is passed.
## Public provider documentation cross-check (2026-10-10)

Flixly's public model page identifies `seedance-2-mini` as a video model and documents text-to-video and image-to-video support, 480p/720p, aspect ratios including 16:9, 9:16 and 1:1, and durations from 4 to 15 seconds. Flixly's developer docs describe `GET /api/v1/models`, `POST /api/v1/generate`, and asynchronous status polling through `GET /api/v1/generations/{id}`. Sources:

- https://www.flixly.ai/models/seedance-2-mini
- https://www.flixly.ai/developers

### Interpretation

This public documentation supports `seedance-2-mini` as a plausible upstream candidate for the intended V2 video capability, and explains the application catalogue slug vs provider model ID distinction. It does **not** prove the existing shared gateway maps the request correctly end-to-end, that the configured Flixly API key is active, or that this product's credit pricing is correct. No API key was used and no provider call was made.

### Remaining go/no-go blockers

- The shared `flixly-video` row is still disabled.
- The shared AI Platform gateway and credit ledger are not verified isolated from production.
- The exact deployed gateway request/response adapter and server-side credit quote still need a code review and isolated integration test.
- Do not enable the shared row or wire the V2 UI to the live project based solely on public documentation.

Decision remains **NO-GO for live generation** until isolation and end-to-end mapping are verified.

## Public model specification cross-check — 2026-10-10

Read-only public documentation review:
- Flixly's Seedance 2.0 Mini model page identifies upstream model ID `seedance-2-mini`, text-to-video and image-to-video support, 480p/720p, aspect ratios including 16:9 and 9:16, and durations from 4 to 15 seconds. Source: https://www.flixly.ai/models/seedance-2-mini
- This makes the UI's currently selected 5 seconds and 16:9 plausible candidate settings for this model. It does not verify the existing OBITREND gateway adapter, actual account access, live availability, request schema compatibility, or price.
- The page gives an upstream API example, but the prototype must not call that API directly or expose a provider key in the browser.
- Current shared catalogue state remains `enabled=false` based on earlier read-only source inspection; the planned 8-credit value is not a verified live quote.
- Therefore the release gate remains **BLOCKED**. Do not enable generation based only on public docs.

## Required verification before enabling

1. Confirm a non-production backend target isolated from live users, balances, storage, and payment data.
2. Inspect the server-side adapter and confirm it translates the OBITREND gateway request to the provider's current schema.
3. Confirm live model availability and quote server-side; never hardcode the planned 8-credit price as a charge.
4. Validate authentication, job ownership, idempotency, polling, output URLs, and failure/ambiguous-job settlement in isolated tests.
5. Obtain explicit owner approval before any real generation test.
