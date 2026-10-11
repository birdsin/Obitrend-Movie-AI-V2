# OBITREND Movie AI V2 — QA Progress

Checked: 2026-10-11 (latest CI and staging inventory rechecked)  
Scope: isolated structural prototype on `feat/obitrend-v2-structural-prototype` only.

## Automated checks

- [x] Latest branch-head QA report commit `fa540ddb94e12d6569109ddbf123a938ee034bb4` passed GitHub Actions: [run 73](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38117742684).
- [x] Prior documentation/checklist workflow runs also passed: [run 70](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38117553253), [run 71](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38117665797), and [run 72](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38117673629).
- [x] Static prototype checks verify 20 primary navigation entries, 35 unique tool IDs, complete tool workspace contracts, demo-only feedback, local reference-preview cleanup, mobile drawer handlers, and absence of literal `fetch(`, `XMLHttpRequest`, and external script `src` patterns in the prototype HTML.

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

- Latest checked branch head before this report refresh: `fa540ddb94e12d6569109ddbf123a938ee034bb4`.
- Latest READY staging deployment found in Vercel inventory: commit `7c6b21cad8c16418f19a8f5b3ab9fbaf3900ea7c`, URL [staging prototype](https://obitrend-movie-ai-v2-fao2gwmht-birdsins-projects.vercel.app/prototypes/obitrend-v2-structural-prototype.html).
- These SHAs do not match. The latest branch source is **not confirmed deployed**. Do not claim deployment until a matching READY deployment is verified.

## Safety boundaries

- Keep PR #6 open and draft; do not merge.
- Do not create a Supabase project or branch.
- Do not connect the prototype to shared/live generation, job, media, account, credit, or payment services.
- Do not invoke provider generation or upload media.
- Keep Generate actions demo-only until an isolated backend and explicit integration authorization exist.
