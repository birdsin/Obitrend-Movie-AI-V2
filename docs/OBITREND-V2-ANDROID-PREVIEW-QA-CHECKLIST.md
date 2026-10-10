# OBITREND Movie AI V2 — Android Preview QA Checklist

Status: manual QA checklist for the isolated structural prototype only. Screenshot review performed 2026-10-10.

## Scope and safety

- Repository: `birdsin/Obitrend-Movie-AI-V2`
- Working branch: `feat/obitrend-v2-structural-prototype`
- Test URL: `https://obitrend-movie-ai-v2-1v935evds-birdsins-projects.vercel.app/prototypes/obitrend-v2-structural-prototype.html`
- This checklist does not authorize production release, real generation, uploads, account writes, credit deductions, or payment actions.
- Do not create a Supabase project or branch. Do not change production services. Keep PR #6 draft and unmerged.

## Confirmed from the supplied Android screenshots

- [x] Premium black-and-gold theme renders on a narrow mobile viewport.
- [x] Header displays the current section and the credit status indicator.
- [x] Home dashboard reports 20 navigation sections and 35 tools.
- [x] My Projects displays a demo project card and project-setup card.
- [x] The workspace includes an input panel and a separate output panel.
- [x] UI explicitly labels project data as not persisted and output as preview-only.
- [x] Download, Save to project, and Try again are visibly locked.
- [x] Safety note states real generation, upload, account, credit, payment, storage, and download services are not connected.

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

## Integration readiness — blocked

Do not wire the prototype to live services until all of the following are independently verified and explicitly authorized:

1. A non-production backend target is identified and proven isolated from live users, data, credits, payments, and storage.
2. Server-authoritative model availability and price are confirmed; the browser does not determine or deduct credits.
3. Auth, job ownership, duplicate-submit protection, polling/reconciliation, and failure release/refund behavior pass isolated tests.
4. Successful output is shown only after the server confirms a succeeded job and valid output reference.
5. The owner approves the exact integration scope.

## Evidence limits

Screenshot review verifies visible layout and safety labels only. It does not prove every button works, all 20 destinations or 35 tools pass manual testing, or any backend integration works end to end.
