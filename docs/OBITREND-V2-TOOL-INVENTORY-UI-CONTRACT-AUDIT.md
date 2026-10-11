# OBITREND Movie AI V2 — Tool Inventory & UI Contract Audit

Reviewed: 2026-10-10  
Scope: read-only source audit of the structural prototype on `feat/obitrend-v2-structural-prototype`. This document does not enable any AI service.

## Audit result

- Navigation destinations: 20.
- Registered tool definitions: 35.
- Tool IDs: 35 unique IDs; no duplicate IDs observed in the current source.
- Source handlers exist for navigation rendering, tool selection, search input, Clear action, mobile menu toggle, local reference preview, and Generate input-review.
- Generate is a local input-review/demo flow only. It does not call an AI API, upload reference media, save a project, or deduct credits.
- Output Download, Save to project, and Try again are intentionally disabled in the structural prototype.
- Local reference preview creates a browser object URL and labels the preview as a source file, not generated output.
- This is source inspection, not a full automated browser click test of every tool or device size.

## Latest static source checks

Read directly from the current feature-branch prototype source. These are static checks, not browser interaction or deployment checks.

| Check | Result | Meaning |
|---|---|---|
| HTML document declaration | Pass | HTML document begins with a doctype. |
| Mobile viewport meta | Pass | A viewport meta tag is present. |
| Navigation definitions | 20 found | Matches the intended 20 destinations. |
| Tool definitions | 35 found | Matches the intended 35 registered tools. |
| Unique tool IDs | 35/35 unique | No duplicate IDs found in the definitions. |
| Local-only reference notice | Present | Source tells users selected files are not uploaded. |
| Demo-only Generate labels | Present | Main tool actions are framed as input review/settings checks. |
| Output actions disabled in source | Present | Download, Save and Retry remain disabled in the reviewed paths. |
| Direct provider/API fetch in prototype | Not found | No direct fetch call to the AI gateway, Flixly or Supabase was detected by the static pattern check. |
| External script source | Not found | No external `script src` was detected in the HTML source. |

**Important limitation:** pattern-based static checks cannot prove that every runtime path is correct, that no indirect network request can occur, or that the deployed page matches this commit. A real browser/network-panel QA pass is still required.

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

## Static UI behavior reviewed

- The source has a dedicated tool object for each of the 35 IDs and renders a standard workspace from that object's title, description, input type, output label, and field list.
- Standard tool Generate buttons are labeled as input review or settings check, not connected generation.
- Special section Generate and Review actions explicitly show demo-only messaging.
- File selection is local-only; file type is checked against the selected tool, a 100 MB browser-demo limit is enforced, and the status explains that no upload or generated result exists.
- Clear resets prompt, selects, local file input and the preview object URL.
- Download, Save, and Retry are disabled in both standard tool and special section panels.
- The source uses hard-coded local option arrays. These are placeholders, not an authoritative provider capability catalogue or live price quote.

## Known limitations / next QA pass

- [ ] Visit each of the 20 navigation destinations on Android and confirm title, content, and return navigation.
- [ ] Select all 35 tools and confirm the title, prompt/text input, relevant settings, output label, and demo-only message.
- [ ] Test search with empty, matching, non-matching, and long queries, including switching between tool categories and special sections.
- [ ] Confirm special panels remain dedicated panels and are not replaced by search results.
- [ ] Confirm no Generate action is mistaken for a completed AI job and no credits are displayed as live balance.
- [ ] Confirm local reference preview remains local, invalid types are rejected, oversized files are rejected, and Clear releases the preview.
- [ ] Confirm refresh does not imply demo projects or outputs were persisted.
- [ ] Check Android portrait, Android landscape, and desktop for clipped controls, horizontal overflow, focus visibility, and readable status messages.
- [ ] Check keyboard/screen-reader labels for every file input, select, action, and status message.
- [ ] Use browser network tools during QA to confirm no AI, storage, account, or credit requests occur.
- [ ] Confirm the current preview deployment actually contains the latest branch commit before reporting deployment status.

## Per-tool UI contract

Every standard tool panel should provide:
1. A tool-specific title and short explanation.
2. Required prompt or text input, with clear validation.
3. Only settings relevant to that tool (for example model, duration, aspect ratio, voice, language, style, quality, or operation).
4. Reference-media input only where the eventual provider contract supports it.
5. A clearly labeled Generate action that states whether it is demo-only or connected.
6. An output panel with accurate idle, validation, pending, success, failure, and unavailable states as appropriate.
7. Save, download, and retry actions only when a real result and the required service are available.

## Release and service safety gate

Do not connect real generation or credits until the exact non-production backend is proven isolated from live users, account data, credits, payments, and storage; server-authoritative model/price data is verified; auth, job ownership, duplicate-submit protection, polling/reconciliation, and failure settlement pass isolated tests; and the owner approves the exact integration.

Keep the existing production app, Supabase projects, Edge Functions, credit engine, Paystack flow, and storage untouched. Keep PR #6 draft and unmerged.
