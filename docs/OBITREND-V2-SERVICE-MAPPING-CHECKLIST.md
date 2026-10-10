# OBITREND Movie AI V2 — Service Mapping & Safe Integration Checklist

Status: planning document only. No service calls, backend changes, or production changes are made by this document.

## Guardrails

- Work only on `feat/obitrend-v2-structural-prototype` and its Vercel preview.
- Do not create a Supabase project or branch; no Supabase branch charges are authorized.
- Do not merge PR #6 or deploy this prototype to production.
- Do not change the existing production app, database, edge functions, provider configuration, authentication, credits, Paystack, or storage.
- Never simulate successful generation, a real credit balance, a price quote, or saved output.
- Any future service wiring requires explicit approval of the exact scope and a safe, isolated test target.

## Existing service surface found in source review

These function names were found in the existing OBITREND AI Platform source. Their presence in source is not proof of successful end-to-end operation.

| Concern | Existing route/function | V2 integration rule |
|---|---|---|
| Authenticated generation gateway | `ai-provider-gateway` | Do not call from the structural prototype. Reuse only after an isolated test target and request contract are approved. |
| Job status and reconciliation | `ai-job-status` | Keep job ownership checks and existing ambiguous-job handling; do not implement a second polling or refund system in the browser. |
| Media/reference upload | `ai-media-upload` | Do not upload real files from the prototype. Map accepted asset types and storage lifecycle before wiring. |
| Credit reservation/settlement | `credit-engine` and server-side RPCs | Never calculate or mutate balances in client-side code. Do not introduce V2-only credit deduction logic. |
| Job creation | `create-ai-job` | Use only through the established authenticated service contract in an approved isolated environment. |
| Payment checkout and verification | `paystack-credit-checkout`, `paystack-credit-verify` | Out of scope for the prototype. Do not initiate payments or change payment redirects. |
| Provider usage display | `movie-provider-usage` | Do not present live usage until authenticated access and the intended display are verified. |

## First candidate: Video Generator

The first candidate for a future integration is Video Generator because the existing source contains a video generation gateway and job-status flow. This is a proposed sequence, not authorization to connect it now.

1. Confirm the exact isolated runtime and backend target. Current Vercel deployment is a UI preview; it is not evidence of an isolated backend.
2. Document the request and response schema from the existing source. Identify required auth, model ID, mode, prompt, settings, reference assets, and project/job identifiers.
3. Verify the model catalog and pricing source. Do not submit a guessed model ID or display guessed credit costs.
4. Implement a thin UI adapter in a separate development-only change; keep provider and credit logic server-side.
5. Add pending, running, succeeded, failed, and ambiguous states. Never show a generated result until a real successful job and output URL are confirmed.
6. Verify duplicate-submit prevention and status reconciliation. A failed generation must follow the existing server-side credit release/refund behavior.
7. Test with a dedicated non-production account and isolated test data. Do not use real payments.
8. Review the diff and preview. Keep the pull request draft and unmerged until the owner explicitly approves release.

## Acceptance tests before any tool is connected

- Unauthenticated requests are blocked by the server.
- A user cannot read or poll another user's job.
- Model availability and price come from verified server data.
- Repeated taps cannot create duplicate jobs or duplicate credit reservations.
- Failed jobs follow the existing release/refund path.
- Ambiguous jobs remain protected until reconciled; the UI does not encourage unsafe retries.
- Output is shown only after success and a valid output reference are returned.
- Reloading the page does not falsely claim that a prototype output was saved.
- No production URLs, secrets, service-role keys, payment mutations, or production writes are added to the prototype.
- Desktop and Android layouts remain usable, with no horizontal overflow and no duplicate header.

## Current release state

- Draft PR: https://github.com/birdsin/Obitrend-Movie-AI-V2/pull/6
- Preview: https://obitrend-movie-ai-v2-rbqiyktr6-birdsins-projects.vercel.app/prototypes/obitrend-v2-structural-prototype.html
- Real AI generation, uploads, account data, credits, payments, and storage remain disconnected in the prototype.
