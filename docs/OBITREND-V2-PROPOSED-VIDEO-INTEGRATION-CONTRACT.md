# OBITREND Movie AI V2 — Proposed Video Integration Contract

Status: **REVIEW ONLY — NO PROVIDER CALLS OR BACKEND CHANGES**
Date: 2026-10-10
Branch: `feat/obitrend-v2-structural-prototype`

## Goal

Define the smallest safe server-mediated contract for the V2 Video Generator while keeping the current staging UI in demo mode. This document is a proposal, not an implementation authorization.

## Product selection

- User-facing model label: `Flixly Video`
- OBITREND catalogue slug candidate: `flixly-video`
- Candidate upstream model ID from public documentation and source review: `seedance-2-mini`
- Planned credit amount: 8 credits, **not approved as a runtime charge until the isolated server returns an authoritative quote**.
- Candidate settings currently shown in the UI: 5 seconds, 16:9.
- Do not show the model as connected until server-side model availability and quote are verified.

## Proposed request lifecycle

1. User signs in through an approved non-production authentication environment.
2. Client requests a server-authoritative model/quote descriptor; it does not submit its own price or decide whether the model is enabled.
3. Client submits a generation request with prompt, approved settings, and server-issued reference asset IDs. The client must not send arbitrary provider credentials, provider URLs, model pricing, or trusted credit values.
4. Server validates identity, model allowlist, settings, input asset ownership/type/size, project ownership, and current quote.
5. Server reserves credits idempotently and creates a job record before provider submission.
6. Server adapter translates the OBITREND catalogue slug to the verified upstream model ID and maps only settings confirmed by the provider contract.
7. Client polls the authenticated job-status route. Status responses must enforce job ownership and avoid exposing provider secrets.
8. On verified success, server validates and records the output asset, commits the reservation, and returns a stable output reference.
9. On definitive failure, server uses the tested release/refund path. On timeout or ambiguous provider outcome, retain the reservation and reconcile before permitting a retry.
10. Download/save/retry controls remain disabled until the server confirms success and a valid output asset.

## Proposed UI contract

- Model state is one of: `unverified`, `available`, `temporarily_unavailable`, `disabled`.
- If model state is not `available`, Generate stays disabled and the UI explains why.
- Quote/credit cost comes from the server, with currency/credit units and expiry/version where available.
- UI prevents duplicate taps, but server idempotency is mandatory.
- Show progress only from server-confirmed job states; never simulate completion.
- A reference selected from the device is only a local preview until a verified upload succeeds and returns an owned asset ID.
- Never label a prompt review, reference preview, placeholder, or failed job as generated output.

## Required isolated acceptance tests

- Missing/expired auth token; unauthorized project and asset IDs; cross-user job ID.
- Disabled/unknown model, stale quote, invalid duration/aspect ratio, oversized or unsupported media.
- Duplicate submit, repeated poll, client refresh, network timeout before and after provider acceptance.
- Provider rejection, definitive failure, ambiguous timeout, delayed success, malformed response, missing/invalid output URL.
- Reserve → commit on success; release on definitive failure; reconciliation for ambiguous jobs.
- No provider API key in browser bundles, network responses, logs, or URLs.
- No credit deduction or output display before server-confirmed state permits it.

## Go/no-go decision

**NO-GO for real generation.** The available Supabase AI Platform is shared and has not been proven isolated from production. The shared Flixly catalogue row is disabled, and the planned 8-credit value is not a verified live quote. Public provider documentation and source inspection do not substitute for an isolated end-to-end test.

## Work permitted before approval

- Read-only review of existing server source and public provider documentation.
- UI-only changes that retain explicit demo labels and disabled output actions.
- Documentation and test-plan improvements on this feature branch.

## Prohibited until isolation and explicit authorization

- Connecting the prototype to a shared production gateway.
- Calling the provider or running model-sync jobs as a test.
- Enabling or changing shared catalogue rows, deploying/modifying Supabase functions, uploading real user media, or executing credit/payment operations.
- Merging PR #6 or promoting staging to production.
