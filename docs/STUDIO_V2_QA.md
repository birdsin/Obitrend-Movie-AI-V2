# Creator Studio V2 — Frontend QA Checklist

Use this checklist against the development preview after each UI commit. Do not treat the prototype as production-ready.

## Layout and navigation
- [ ] No left sidebar at any viewport size.
- [ ] Premium black/orange/gold palette, readable contrast, visible focus indicators.
- [ ] Intro animation can be skipped and respects reduced-motion settings.
- [ ] Search filters all 35 catalogue items and hides empty categories.
- [ ] Each of the 35 cards opens its own workspace with the correct title and description.
- [ ] Workspace closes without navigating away or losing the entire page.
- [ ] No horizontal overflow at 320px, 360px, 390px, tablet, and desktop widths.
- [ ] Buttons and form controls are keyboard accessible and have accessible names.

## Authentication UI (not yet connected)
- [ ] Create Account, Log In, and Forgot Password screens switch correctly.
- [ ] Show/Hide password controls work independently for both password fields.
- [ ] Password mismatch is shown accessibly.
- [ ] Form labels and autocomplete attributes are correct.
- [ ] UI clearly states when authentication is not connected.
- [ ] No password or personal information is persisted in local storage or sent to an unconfigured endpoint.

## Tool workspace UI (not yet connected)
- [ ] Prompt field, aspect ratio, quality, and requested duration render.
- [ ] Generate remains disabled while no backend/provider is configured.
- [ ] UI never displays a fabricated job ID, progress result, media file, credit balance, or payment success.
- [ ] When backend integration is added, verify requested video duration against actual returned metadata.

## Localization
- [ ] Language selector selection persists only after an explicit preference mechanism is implemented.
- [ ] Every visible label is translated for each supported locale before claiming full language support.
- [ ] Arabic layout uses correct RTL direction; mixed numbers/URLs remain readable.
- [ ] Fallback behavior exists for untranslated strings.

## Release gates
- [ ] Build and runtime console checks pass.
- [ ] Mobile and desktop smoke tests pass.
- [ ] Authentication/security tests pass against the isolated development backend.
- [ ] RLS ownership isolation tests pass.
- [ ] Credit concurrency, refund, and payment webhook replay tests pass.
- [ ] Provider errors, retries, timeout handling, and video-duration checks pass.
- [ ] Production backup and rollback are verified before any production cutover.
