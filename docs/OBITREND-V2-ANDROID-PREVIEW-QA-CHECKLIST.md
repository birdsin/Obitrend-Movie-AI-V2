# OBITREND Movie AI V2 — Android Preview QA Checklist

Status: manual QA checklist for the isolated structural prototype only. User confirmed the fresh staging preview is working on Android on 2026-10-10; this confirms the page loads, not every workflow.

## Scope and safety

- Repository: `birdsin/Obitrend-Movie-AI-V2`
- Working branch: `feat/obitrend-v2-structural-prototype`
- Latest verified staging test URL: `https://obitrend-movie-ai-v2-b8vury0cx-birdsins-projects.vercel.app/prototypes/obitrend-v2-structural-prototype.html`
- Latest verified commit: `6b0d4ebbc454e9877d62eef35bae1a2345ef81ac`
- User confirmed the current preview is working on 2026-10-10.
- This checklist does not authorize production release, real generation, uploads, account writes, credit deductions, or payment actions.
- Do not create a Supabase project or branch. Do not change production services. Keep PR #6 draft and unmerged.

## Confirmed from the supplied Android screenshots and user feedback

- [x] Premium black-and-gold theme renders on a narrow mobile viewport.
- [x] Header displays the current section and the credit status indicator.
- [x] Home dashboard reports 20 navigation sections and 35 tools.
- [x] My Projects displays a demo project card and project-setup card.
- [x] The workspace includes an input panel and a separate output panel.
- [x] UI explicitly labels project data as not persisted and output as preview-only.
- [x] Download, Save to project, and Try again are visibly locked.
- [x] Safety note states real generation, upload, account, credit, payment, storage, and download services are not connected.
- [x] User reports that the latest staging preview is working.

## Manual checks still required on Android

- [ ] Open the menu and visit all 20 destinations; confirm each opens the intended section and the menu closes after selection.
- [ ] For each of the 35 tools, verify the correct input controls and output label are shown for the selected tool.
- [ ] Tap Generate with an empty prompt; confirm useful validation and no network request.
- [ ] Enter a prompt and select settings; confirm Generate only performs local/demo validation and never claims an AI result exists.
- [ ] Select a reference file; confirm the preview remains local and no upload request is sent.
- [ ] Tap each “Review workflow (demo only)” button in History, My Projects, AI Models & Credits, and Settings & Support; confirm it only shows demo feedback.
- [ ] Confirm Search does not replace or corrupt the special panels.
- [ ] Confirm Clear resets prompt, selected settings, and local reference selection.
- [ ] Scroll top-to-bottom; verify no horizontal page overflow, clipped primary controls, or inaccessible output actions.
- [ ] Check small Android viewport, browser address bar expanded/collapsed, and on-screen keyboard open.
- [ ] Refresh the page; verify no demo project or output is falsely described as saved or persisted.

## Android staging smoke test — user-confirmed PASS — 2026-10-10

The user completed the six-step smoke test on the fresh staging preview and reported:

- [x] Dashboard opens: PASS
- [x] Video Generator opens: PASS
- [x] Empty prompt shows validation: PASS
- [x] Demo-only message appears for a test prompt: PASS
- [x] Clear inputs resets the form: PASS
- [x] Refresh does not claim demo data was saved: PASS
- Visible issue: not specified

These are user-reported manual results for the six listed checks. They do not establish that all 20 navigation destinations or all 35 tools have passed QA.

## Static source audit — prototype only — 2026-10-10

Read-only source inspection of `prototypes/obitrend-v2-structural-prototype.html` found:

- [x] 20 navigation definitions.
- [x] 35 tool definitions with 35 unique IDs.
- [x] Mobile menu and overlay close handlers are present.
- [x] Clear-input handler resets prompt, select values, and local reference selection.
- [x] Reference previews use a browser-local object URL and label the source as not uploaded.
- [x] Download, Save, and Retry output actions are disabled in the prototype.
- [x] Static source scan found no literal `fetch(` call, `XMLHttpRequest`, or external script `src` in this HTML file.

Evidence limit: this is a pattern-based source inspection, not a runtime network capture, accessibility audit, or click-through of every destination/tool. It does not prove absence of every possible network request or establish backend integration.

## Integration readiness — blocked

Do not wire the prototype to live services until all of the following are independently verified and explicitly authorized:

1. A non-production backend target is identified and proven isolated from live users, data, credits, payments, and storage.
2. Server-authoritative model availability and price are confirmed; the browser does not determine or deduct credits.
3. Auth, job ownership, duplicate-submit protection, polling/reconciliation, and failure release/refund behavior pass isolated tests.
4. Successful output is shown only after the server confirms a succeeded job and valid output reference.
5. The owner approves the exact integration scope.

## Evidence limits

Vercel reports the fresh staging deployment as READY for commit `6b0d4ebbc454e9877d62eef35bae1a2345ef81ac`, and the user confirms the fresh preview is working on Android. Earlier screenshots support visible layout checks. This does not prove every button works, all 20 destinations or 35 tools pass manual testing, or any backend integration works end to end.

## Android Video Generator test evidence — 2026-10-10

Observed in the user-provided Android screenshots:

- [x] Video Generator section opens and displays the reference picker, model selector, duration, aspect ratio, generation status, and Clear inputs control.
- [x] With no prompt entered, the UI asks for a video description rather than treating a reference image as sufficient.
- [x] With a prompt entered but no verified model selected/connected, the UI states that it cannot generate a video yet.
- [x] The visible safety copy says no provider is called and no credits are used in demo mode.
- [x] Duration currently displays 5 seconds and aspect ratio displays 16:9 Landscape as UI selections only; these are not evidence of provider support or a successful generation.
- [x] The UI does not claim a video was generated.

### Current blocker

The model selector reports “No verified AI model connected.” This is expected until the model catalogue and quote are verified from a safe backend. The candidate Flixly Video / `flixly-video` catalogue entry remains disabled in the shared catalogue, and the listed 8-credit value is not an authoritative live quote. Do not enable the browser Generate action or connect it to the shared production gateway.

### Remaining safe next steps

1. Identify and prove an already-existing isolated non-production backend target, without creating a Supabase project or branch.
2. Confirm the Flixly model mapping and authoritative server-side price/quote using read-only source review or an approved test environment.
3. Only after explicit authorization, run integration tests using a dedicated non-production account and test data.


## Next-run Android smoke test — user execution

Use the staging preview only:
https://obitrend-movie-ai-v2-b8vury0cx-birdsins-projects.vercel.app/prototypes/obitrend-v2-structural-prototype.html

The six-step smoke test above is now complete. Continue with the full 20-destination / 35-tool review:

1. Open the URL in Chrome on Android and wait for the dashboard to finish rendering.
2. Open the menu, choose **Video Generator**, and verify the page changes.
3. Leave the prompt empty and tap Generate. Expected: a prompt validation message; no video, upload, or credit use.
4. Enter a short test prompt and tap Generate. Expected: a clear “no verified model connected” / demo-only message; no claimed generation.
5. Tap Clear inputs. Expected: the prompt and local reference selection reset.
6. Refresh once. Expected: no claim that demo project/output data was saved.

For the remaining full review, record results in the next chat message using:
- Dashboard opens: PASS / FAIL
- Video Generator opens: PASS / FAIL
- Empty-prompt validation: PASS / FAIL
- Demo-only message: PASS / FAIL
- Clear inputs: PASS / FAIL
- Refresh behavior: PASS / FAIL
- Any visible issue: short description or “none”

Do not enter payment details, attempt a real generation, or test against production. This is a manual visual/interaction smoke test; it does not establish backend integration readiness.
