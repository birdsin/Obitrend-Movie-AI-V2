# OBITREND Movie AI V2 — QA Progress

Checked: 2026-10-11 (latest branch, CI, and staging inventory rechecked)  
Scope: isolated structural prototype on `feat/obitrend-v2-structural-prototype` only.

## Automated checks

- [x] QA report refresh commit `2b4c9306535a861c1f3caca104555e1bef04e702` passed mock/static CI: [run 38118445991](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38118445991).
- [x] Android checklist correction commit `8f8411520ca7ee01141c450ba6c566bbdb841e06` passed mock/static CI: [run 38118815739](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38118815739).
- [x] A first attempt at the new checklist regression test failed because its regular-expression patterns were over-escaped: [run 38118864202](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38118864202). This failure was investigated and the patterns corrected.
- [x] Corrected regression-test commit `6b40f6f2431d8ddcb662dcee2e052f271d1ea6cc` passed both CI runs: [run 38119037533](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38119037533) and [run 38119039605](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38119039605).
- [x] QA report commit `57d1cfcc62fe178b6d4c5d09bba17ecefbf7340e` passed mock/static CI: [run 38119252556](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38119252556).
- [x] Latest branch-head documentation commit `9acbcbb42e8364592e0accae239afce21a3b5fce` passed mock/static CI: [run 38119295053](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38119295053).
- [x] Static source tests check 20 navigation entries, 35 unique tool IDs, complete tool workspace contracts, demo-only feedback, local reference-preview cleanup, mobile drawer handlers, and absence of literal `fetch(`, `XMLHttpRequest`, and external script `src` patterns in the prototype HTML.
- [x] Checklist regression test checks that the manual QA matrix contains 35 tool rows and that staging evidence wording remains accurate.

These are source/mock tests. They are not provider integration tests, an automated browser run, a full accessibility audit, or proof that every control works at runtime.

## Manual QA still outstanding

Use the [Android preview QA checklist](OBITREND-V2-ANDROID-PREVIEW-QA-CHECKLIST.md) and record actual observed results:

1. Click through all 20 navigation destinations on Android.
2. Exercise each of the 35 tool panels and verify its input controls and output label.
3. Verify local-only reference preview and confirm no upload/network call using available browser tooling.
4. Check Search, Clear, demo workflow buttons, mobile scrolling, keyboard-open layout, and refresh behavior.
5. Capture screenshots for failures and mark only observed results as passed.

The six-step smoke test was user-confirmed on 2026-10-10; it does not replace the full click-through matrix.

## Deployment status

- Current verified branch head at the time of this check: `9acbcbb42e8364592e0accae239afce21a3b5fce`.
- Latest READY staging deployment found in the Vercel inventory: commit `7c6b21cad8c16418f19a8f5b3ab9fbaf3900ea7c`, URL [staging prototype](https://obitrend-movie-ai-v2-fao2gwmht-birdsins-projects.vercel.app/prototypes/obitrend-v2-structural-prototype.html).
- These SHAs do not match. The latest branch source is **not confirmed deployed**. The live preview URL returned HTTP 200 and served the prototype HTML, but this does not mean it contains the latest branch commit. Do not claim deployment until a matching READY deployment is verified.

## Safety boundaries

- Keep PR #6 open and draft; do not merge.
- Do not create a Supabase project or branch.
- Do not connect the prototype to shared/live generation, job, media, account, credit, or payment services.
- Do not invoke provider generation or upload media.
- Keep Generate actions demo-only until an isolated backend and explicit integration authorization exist.
