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