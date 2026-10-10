# OBITREND Movie AI V2 — Staging Handoff

Checked: 2026-10-10
Branch: `feat/obitrend-v2-structural-prototype`
PR: [Draft PR #6](https://github.com/birdsin/Obitrend-Movie-AI-V2/pull/6) — keep open and unmerged.

## Current staging preview

- Preview page: https://obitrend-movie-ai-v2-ij6726og1-birdsins-projects.vercel.app/prototypes/obitrend-v2-structural-prototype.html
- Vercel deployment ID: `dpl_J9SVYtqkQPcsKgS9BLaWKMPUsXpV`
- Deployment state: `READY`
- Target: `staging`
- Deployed source commit: `6febd67411c55f442204ef887a6dbe6019d313cf`
- Commit summary: `Add 35-tool manual QA matrix`

The staging deployment was confirmed READY by Vercel. This does not claim that an HTTP fetch or all UI workflows were verified in an automated browser.

## QA state

- User-confirmed Android smoke checks: dashboard opens, Video Generator opens, empty prompt validation, demo-only response, Clear inputs, and refresh does not claim demo data persisted.
- Source inventory: 20 navigation definitions and 35 unique tool IDs.
- Full click-through of all 20 destinations and 35 tool workflows remains pending manual execution.
- Output actions (Download, Save to project, Try again) remain disabled in the prototype.
- The current prototype is a local/demo input-review experience, not connected real generation.

## Safety gate

Keep real generation blocked. Read-only inspection of the Vercel project returned no project environment variables visible in the inventory (`envs: []`, `hiddenProductionEnvCount: 0`). This is not proof of a safe isolated backend.

Do not:
- create a Supabase project or branch;
- connect to shared production AI, job, storage, account, credit, or payment services;
- invoke provider generation, upload media, create jobs, or mutate credit/payment state;
- merge PR #6 or deploy to production.

## Next manual test

Open the staging preview on Android and work through the full matrix in [the Android preview QA checklist](https://github.com/birdsin/Obitrend-Movie-AI-V2/blob/feat/obitrend-v2-structural-prototype/docs/OBITREND-V2-ANDROID-PREVIEW-QA-CHECKLIST.md). Record failures with the tool name and a screenshot. Do not mark a tool passed solely because it exists in source.
