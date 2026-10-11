# OBITREND Movie AI V2 — QA Progress

Checked: 2026-10-11  
Scope: isolated structural prototype on `feat/obitrend-v2-structural-prototype` only.

## Automated checks

- [x] Push workflow passed for commit `ae4bbf625a6bf7e7bbd378a0bf4e6f2299b237e2`: [run 51](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38112887281).
- [x] Pull-request workflow passed for the same commit: [run 52](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38112889846).
- [x] Push workflow passed for commit `c7e2cf2870852e2b4a38d3eff0c8202e5c7e8d6b`: [run 64](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38114378216).
- [x] Pull-request workflow passed for the same commit: [run 65](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38114380898).
- [x] Latest observed pull-request workflow passed for documentation commit `2587d49f2c83d288cf49bf515d52c4f3d3ca4d8b`: [run 67](https://github.com/birdsin/Obitrend-Movie-AI-V2/actions/runs/38114459250). This is mock/static CI, not a browser or provider integration test.
- [x] Static prototype safety test counts 20 inline navigation entries and checks 35 unique tool IDs.
- [x] Static safety test checks for demo-only/local-only safety copy and scans the prototype HTML for literal `fetch(`, `XMLHttpRequest`, and external script `src` patterns.

These checks are automated source/mock tests. They are not provider integration tests, an automated browser run, a full accessibility audit, or proof that every control works at runtime.

## Manual QA still outstanding

Use the [Android preview QA checklist](OBITREND-V2-ANDROID-PREVIEW-QA-CHECKLIST.md) and record actual observed results. In particular:

1. Click through all 20 navigation destinations on Android.
2. Exercise each of the 35 tool panels and verify its input controls and output label.
3. Verify local-only reference preview and confirm no upload/network call using available browser tooling.
4. Check Search, Clear, demo workflow buttons, mobile scrolling, keyboard-open layout, and refresh behavior.
5. Capture screenshots for failures and mark only observed results as passed.

The existing six-step smoke test was user-confirmed on 2026-10-10. It does not replace the full click-through matrix.

## Deployment status

The latest READY staging deployment found in the Vercel inventory references commit `7c6b21cad8c16418f19a8f5b3ab9fbaf3900ea7c` (message: `Allow demo input review without verified model`). It does not match the latest branch documentation commit `2587d49f2c83d288cf49bf515d52c4f3d3ca4d8b`. The latest branch source is therefore not confirmed deployed. Do not claim it is deployed until a matching deployment is verified.

## Safety boundaries

- Keep PR #6 open and draft; do not merge.
- Do not create a Supabase project or branch.
- Do not connect the prototype to shared/live generation, job, media, account, credit, or payment services.
- Do not invoke provider generation or upload media.
- Keep Generate actions demo-only until an isolated backend and explicit integration authorization exist.
