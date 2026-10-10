# OBITREND Movie AI V2 — Tool Inventory & UI Contract Audit

Reviewed: 2026-10-10  
Scope: read-only audit of the structural prototype on `feat/obitrend-v2-structural-prototype`. This document does not enable any AI service.

## Audit result

- Navigation destinations: 20.
- Registered tool definitions: 35.
- Tool IDs: 35 unique IDs; no duplicate IDs observed in the current source.
- UI handlers observed in source: navigation rendering, tool selection, search input, Clear action, menu toggle, and Generate input-review handler.
- Generate is a local input-review/demo flow only. It does not call an AI API, upload reference media, save a project, or deduct credits.
- Output Download, Save to project, and Try again are intentionally disabled in the structural prototype.
- This is a source inspection, not a full automated browser test of every tool.

## Navigation-to-tool assignments found in source

| Navigation destination | Registered tools |
|---|---|
| Home / Movie Creator | Long Video Generator; Story Creator; Montage Studio; Movie Scene Builder; Movie Timeline & Assembly; Scene Continuity Checker |
| Video Generator | Video Generator |
| Image Generator | Image Generator |
| 3D Generator | 3D Generator |
| Character Studio | AI Headshots; AI Avatar; Character Reference Manager |
| Motion Studio | Stop Motion Studio; Motion Control; Motion Poster; Motion Type Studio |
| Audio Studio | Text to Speech; Voice Cloning; Music Generator |
| Lip Sync Studio | Lip Sync Video |
| Video Tools | Video Tools |
| Image Tools | Image Tools |
| Captions & Subtitles | Auto Captions |
| Product Studio | Product Mockup; Virtual Try-on |
| Brand Studio | Logo Generation; Book Cover |
| Design Studio | Manga Creator; Meme Generator; QR Code Art; Landing Page; Background Generator; Pattern Generator |
| Social Media Studio | Thumbnail Generator; Social Media Posts |

Special destinations such as My Projects, My Creations & History, AI Models & Credits, and Settings & Support use dedicated informational panels rather than the standard tool form. They must remain separate and must not be replaced by tool-search results.

## Per-tool UI contract

Every standard tool panel should provide:
1. A tool-specific title and short explanation.
2. Required prompt or text input, with clear validation.
3. Only settings relevant to that tool (for example model, duration, aspect ratio, voice, language, style, quality, or operation).
4. Reference-media input only where the eventual provider contract supports it.
5. A clearly labeled Generate action that states whether it is demo-only or connected.
6. An output panel with accurate idle, validation, pending, success, failure, and unavailable states as appropriate.
7. Save, download, and retry actions only when a real result and the required service are available.

## Findings to verify in the next manual QA pass

- [ ] Visit each of the 20 navigation destinations and confirm the selected section title matches.
- [ ] Select all 35 tools and verify that the title, prompt/text input, settings, and output label match the selected tool.
- [ ] Confirm tool search filters only the standard tool library and never replaces the special panels.
- [ ] Confirm Generate is never presented as successful generation when only local validation occurred.
- [ ] Confirm a reference file remains local and does not trigger a request.
- [ ] Confirm refresh does not imply demo projects or outputs were persisted.
- [ ] Check Android portrait and desktop layouts for clipped controls and horizontal overflow.

## Release and service safety gate

Do not connect real generation or credits until the exact non-production backend is proven isolated from live users, account data, credits, payments, and storage; server-authoritative model/price data is verified; auth, job ownership, duplicate-submit protection, polling/reconciliation, and failure settlement pass isolated tests; and the owner approves the exact integration.

Keep the existing production app, Supabase projects, Edge Functions, credit engine, Paystack flow, and storage untouched. Keep PR #6 draft and unmerged.
