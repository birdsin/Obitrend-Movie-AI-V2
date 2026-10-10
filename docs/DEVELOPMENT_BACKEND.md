# OBITREND Movie AI V2 — Isolated Rebuild Plan

## Guardrails
- This rebuild lives on `feature/premium-gold-rebuild` and must not be merged to production until acceptance tests pass.
- Do not alter the separate OBITREND publishing/sports Supabase project.
- Do not drop, truncate, or overwrite production tables or records during development.
- The `studio-v2.html` page is a UI prototype only. It does not authenticate users or generate media.
- Do not put Supabase service-role keys, Paystack secret keys, or provider credentials in browser code.

## Development environment
Create a separate Supabase development project (preferred) or a separately billed development branch only after the user confirms the organization and acknowledges the current quoted cost. Use test accounts, test payment mode, and non-production provider keys. Production credentials and customer data must not be copied into development.

## Implementation sequence
1. Create isolated backend and record project URL, publishable key, region, and secret configuration locations.
2. Configure Supabase Auth: email/password signup, email verification, sign-in, sign-out, password recovery, and session refresh.
3. Add profile and preferences tables with row-level security (RLS). A user can read/update only their own profile.
4. Add a server-side job API and job lifecycle (queued, running, succeeded, failed, cancelled), ownership checks, idempotency keys, and status polling.
5. Add credit ledger with immutable entries and atomic reservation/capture/refund operations. Never trust a client-provided balance or cost.
6. Add Paystack test-mode checkout and server-side transaction verification plus signed webhook verification and idempotent reconciliation.
7. Add private media storage with ownership checks and short-lived signed URLs.
8. Connect the dashboard tool cards to authenticated workspaces. A tool is not considered complete until its inputs, validation, generate action, progress state, result view, and error/retry states work.
9. Test mobile/desktop layouts, auth recovery, access control, duplicate submissions, insufficient credits, provider timeouts, exact requested video duration, payment replay, webhook retries, and rollback.
10. Only after sign-off, plan a production cutover with backups, migration reconciliation, monitoring, and a tested rollback path.

## Initial data model (development only)
- `profiles`: auth user ID, display name, preferred locale, timestamps.
- `projects`: owner user ID, name, metadata, timestamps.
- `ai_jobs`: owner user ID, tool key, status, requested settings, provider job reference, output metadata, error code, idempotency key, timestamps.
- `credit_accounts`: owner user ID and derived/controlled balance metadata; do not permit client-side balance updates.
- `credit_ledger`: immutable debit/credit/reservation/release/refund entries with unique idempotency keys and references.
- `payment_transactions`: owner user ID, provider reference, amount/currency, status, verification timestamps, idempotency reference.
- `user_preferences`: owner user ID, locale, reduced-motion preference, and UI settings.

All tables containing user-owned data require RLS. Monetary and credit-changing operations must be server-side and transactional. Store only the minimum personal data required.

## Acceptance gates
- Signup and email verification work end to end.
- Login, logout, expired session handling, and password reset work.
- User A cannot read User B's profile, jobs, media, payments, or credit ledger.
- Credits cannot go negative through concurrent requests or repeated requests.
- A payment is credited only after server-side verification; webhook replay does not duplicate credits.
- A requested video duration is validated against the provider output and any mismatch is reported, not silently presented as success.
- Every catalogue entry routes to a meaningful workspace; unavailable provider capabilities are clearly marked rather than faked.
- No production change occurs until these gates pass.
