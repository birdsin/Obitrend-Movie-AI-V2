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
