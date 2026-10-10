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


## Static capability and mapping review — 2026-10-10

This section records compatibility checks from the existing source review and public model documentation. It is not a live capability query and does not authorize enabling the model.

| Field | V2 / adapter observation | Public model documentation observation | Required disposition |
|---|---|---|---|
| Catalogue ID | `flixly-video` | Provider model candidate is `seedance-2-mini` | Keep mapping server-side and explicit; verify against the authenticated provider model list before use. |
| Duration | Existing adapter audit found a 1–30 second clamp; current UI selection is 5 seconds. | Candidate model page documents 4–15 seconds. | Treat 4–15 seconds as the documented candidate range, not a verified runtime guarantee. Reject out-of-range values server-side; remove any silent clamp that can transform a user's requested duration. Confirm request field and exact supported increments from the authenticated schema. |
| Resolution | No verified V2-to-provider resolution mapping recorded. | Public page lists 480p and 720p. | Do not infer a default; verify accepted field names and model-specific values before exposing resolution controls. |
| Aspect ratio | Current UI shows 16:9. | Public page lists 16:9, 9:16, 1:1, 21:9, 4:3 and 3:4. | Validate against the server-side capability list; never trust arbitrary client strings. |
| Input mode | V2 reference picker is local-only; no owned server asset ID is established. | Candidate model supports text-to-video and image-to-video. | Image-to-video stays unavailable until upload, ownership, type/size limits, and provider-readable asset handling are verified. |
| Audio | No verified UI/request/response mapping recorded. | Public page mentions optional synchronized audio. | Keep hidden until exact request schema and output behavior are verified. |
| Async status | Adapter audit flagged a potentially incorrect fallback label (`seedance-2-5`) and unresolved status aliases. | Provider generation is asynchronous and must be polled. | Use the submitted job's verified model ID and documented provider status mapping; unknown statuses remain non-success and must not show output. |
| Output | No end-to-end verified output persistence or download contract. | Public examples mention output URL fields, but the exact authenticated model response is not verified. | Validate response schema, output URL host/type, ownership, persistence and authorized download before enabling output actions. |
| Price | Shared catalogue row is disabled; 8 credits is only a planned value. | Public docs do not establish OBITREND's authoritative customer price. | Require a fresh server-authoritative quote and approved pricing policy; never bill from a browser constant or stale catalogue display. |

### Mapping questions that remain open

- Exact authenticated request fields for prompt, duration, aspect ratio, resolution, image input, and audio.
- Exact provider response fields for generation ID, state, errors, result URL, and charged provider credits.
- Whether the provider returns a temporary URL, and its expiry/retention rules.
- Which status values mean queued, running, succeeded, failed, or ambiguous, including retry semantics.
- Whether a retry after timeout can duplicate provider work and how idempotency is supported.
- Which existing storage and credit settlement operations can be safely exercised in an already-isolated test environment.

**Outcome:** static review identifies a concrete duration mismatch (adapter clamp 1–30 seconds versus public model documentation 4–15 seconds) and several unresolved mappings. Do not fix this by changing shared backend code or by guessing provider fields. Keep the prototype in demo mode until the authenticated contract and isolated environment are verified.


## Existing non-production target discovery — 2026-10-10

A read-only inventory of the connected Supabase organization returned two existing projects:

- `OBITREND` — ref `vjlitqujcujwsislprfg`, created 2026-08-13.
- `OBITREND AI Platform` — ref `gclshpaipluhvlsznugl`, created 2026-10-06.

The inventory does not identify a third, dedicated V2 test project. The AI Platform was previously found to host shared gateway, job-status, media-upload, credit, model-sync, and usage functions. Project existence or healthy status does not prove tenant, wallet, storage, credentials, job data, or billing isolation.

**Environment gate remains BLOCKED:** no existing isolated non-production backend has been demonstrated. Do not use either project for live integration tests or change their schema, functions, model catalogue, credentials, or billing. Do not create a new project or branch. The next permissible step is to locate existing deployment/environment configuration and verify isolation using read-only evidence; if no isolated target exists, stop before backend/provider testing and request explicit authorization for any proposed alternative.
