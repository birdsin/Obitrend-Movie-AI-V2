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
