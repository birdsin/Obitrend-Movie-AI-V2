# OBITREND Movie AI V2 — QA Progress

Checked: 2026-10-11 (user-confirmed full Android QA on staging; deployment verified READY)  
Scope: isolated structural prototype on `feat/obitrend-v2-structural-prototype` only.

## Automated checks

- [x] QA report refresh commit `2b4c9306535a861c1f3caca104555e1bef04e702` passed mock/static CI: [run 38118445991](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38118445991).
- [x] Android checklist correction commit `8f8411520ca7ee01141c450ba6c566bbdb841e06` passed mock/static CI: [run 38118815739](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38118815739).
- [x] A first attempt at the new checklist regression test failed because its regular-expression patterns were over-escaped: [run 38118864202](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38118864202). This failure was investigated and the patterns corrected.
- [x] Corrected regression-test commit `6b40f6f2431d8ddcb662dcee2e052f271d1ea6cc` passed both CI runs: [run 38119037533](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38119037533) and [run 38119039605](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38119039605).
- [x] QA report commit `57d1cfcc62fe178b6d4c5d09bba17ecefbf7340e` passed mock/static CI: [run 38119252556](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38119252556).
- [x] Earlier branch-head documentation commit `9acbcbb42e8364592e0accae239afce21a3b5fce` passed mock/static CI: [run 38119295053](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38119295053).
- [x] Commit `7f5f2acceabd653a4b20b8ccab1de54086d7268d` passed mock/static CI: [run 38123859021](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38123859021), run #88.
- [x] User confirmed Android staging QA passed for all 20 sidebar sections, expected workspaces, all 35 tool cards, search and clear, local reference preview, mobile output panel layout, and demo-only/no-credit behavior.
- [x] Accessible mobile-navigation source changes were added with Escape-to-close, `aria-expanded`, and active destination indication. An initial CI run failed because a static test still expected the previous menu handler; the test was updated to assert the new behavior. Run #88 passed on the updated head.
- [x] Static source tests check 20 navigation entries, 35 unique tool IDs, complete tool workspace contracts, demo-only feedback, local reference-preview cleanup, mobile drawer handlers, and absence of literal `fetch(`, `XMLHttpRequest`, and external script `src` patterns in the prototype HTML.
- [x] Checklist regression test checks that the manual QA matrix contains 35 tool rows and that staging evidence wording remains accurate.

These are source/mock tests. They are not provider integration tests, an automated browser run, or a full accessibility audit. The separate Android manual QA results above are user-confirmed.

## Manual QA results

User-confirmed Android staging QA on 2026-10-11:

- [x] All 20 sidebar sections open correctly.
- [x] Each section displays its expected workspace.
- [x] All 35 tool cards open the right input panel.
- [x] Search finds tools and Clear inputs resets fields.
- [x] Reference image/video preview stays local.
- [x] Output panel remains visible and usable on mobile.
- [x] No false success message or real credit deduction.

This is user-observed mobile QA, not an automated browser test or provider integration test. Continue regression checks after further code changes.

## Deployment status

- Latest verified staging deployment: [open staging prototype](https://obitrend-movie-ai-v2-99yoelrg0-birdsins-projects.vercel.app/prototypes/obitrend-v2-structural-prototype.html).
- Vercel reports deployment `dpl_EXmgwpa8HctPJ3Kao2mxXZGs6AZ9` as `READY`, target `staging`, for commit `219d921759082bd28b73bc849c4835bc9a28e508` on `feat/obitrend-v2-structural-prototype`.
- The prototype URL returned HTTP 200 and its served HTML contains the accessible mobile navigation behavior. User subsequently confirmed the navigation works on Android and reported all 20 sections and 35 tool panels passed manual QA.
- PR #6 remains open, draft, and unmerged.

## Safety boundaries

- Keep PR #6 open and draft; do not merge.
- Do not create a Supabase project or branch.
- Do not connect the prototype to shared/live generation, job, media, account, credit, or payment services.
- Do not invoke provider generation or upload media.
- Keep Generate actions demo-only until an isolated backend and explicit integration authorization exist.
