# OBITREND Movie AI V2 — Structural Plan

Status: proposal and isolated UI prototype; not a production deployment.

## Goals
- Create a premium black-and-gold AI movie Creator Studio.
- Organize the application around 20 primary navigation destinations.
- Register 35 AI creation and movie-production tools.
- Give each implemented tool a dedicated input panel, settings, Generate action, status, output preview, and supported save/export actions.
- Preserve the existing authentication, generation gateway, provider pipeline, credit accounting, payments, and storage services.

## Visual system
- Background: #0B0F1A
- Primary gold: #E6B95E
- Secondary gold: #C9A86A
- Dark charcoal panels, restrained borders, high-contrast labels.
- Desktop: sidebar + central workspace + output panel.
- Mobile: collapsible sidebar, vertically stacked panels, no horizontal overflow, reduced motion.

## 20 primary navigation destinations
1. Home
2. Movie Creator
3. Video Generator
4. Image Generator
5. 3D Generator
6. Character Studio
7. Motion Studio
8. Audio Studio
9. Lip Sync Studio
10. Video Tools
11. Image Tools
12. Captions & Subtitles
13. Product Studio
14. Brand Studio
15. Design Studio
16. Social Media Studio
17. My Projects
18. My Creations & History
19. AI Models & Credits
20. Settings & Support

## 35-tool register
1. Video Generator
2. Image Generator
3. 3D Generator
4. Text to Speech
5. Voice Cloning
6. Music Generator
7. Stop Motion Studio
8. Long Video Generator
9. Story Creator
10. Montage Studio
11. Manga Creator
12. Motion Control
13. Motion Poster
14. Motion Type Studio
15. Thumbnail Generator
16. Social Media Posts
17. Video Tools
18. Image Tools
19. Lip Sync Video
20. Auto Captions
21. Logo Generation
22. AI Headshots
23. AI Avatar
24. Product Mockup
25. Virtual Try-on
26. Book Cover
27. Meme Generator
28. QR Code Art
29. Landing Page
30. Background Generator
31. Pattern Generator
32. Movie Scene Builder (proposed OBITREND utility)
33. Character Reference Manager (proposed OBITREND utility)
34. Movie Timeline & Assembly (proposed OBITREND utility)
35. Scene Continuity Checker (proposed OBITREND utility)

The four proposed movie-production utilities above are OBITREND design proposals, not claims about Flixly.

## Standard tool panel
Each tool should provide:
1. Tool title and short instructions.
2. Inputs specific to that tool (prompt, text, images, video, audio, or project assets).
3. Only supported model and settings controls.
4. Verified cost quote before generation when credits apply.
5. Generate action with validation and duplicate-submit prevention.
6. Honest queued/running/succeeded/failed status.
7. Output preview appropriate to the media type.
8. Save, download, retry, or edit actions only when implemented.
9. Accessible keyboard controls and clear mobile layout.

## Movie pipeline
1. Create project and define project metadata.
2. Develop story/script and scene list.
3. Create and save character references.
4. Define locations and shot descriptions.
5. Generate scene assets with connected services.
6. Assemble clips, audio, captions, and titles on a timeline.
7. Review continuity and transitions.
8. Render/export through supported services.
9. Save project state and media references.

## Core service and safety boundaries
- UI additions must not silently replace or bypass existing AI gateway/provider integrations.
- Never display an unconnected model as available.
- Never guess generation costs or deduct credits in the browser.
- Keep credit accounting and payment verification server-side.
- Prevent duplicate submissions and reconcile ambiguous jobs before retrying.
- Follow the existing failure/refund rules.
- Store real job records and durable media references; do not label placeholder output as a successful generation.
- Keep secrets out of client-side code.
- Do not change production services or deploy to production as part of this structural prototype.

## Delivery phases
1. Review this structure and the isolated prototype.
2. Validate the navigation and responsive layout.
3. Map each tool to existing verified services.
4. Connect project and media persistence.
5. Integrate the movie pipeline in small testable increments.
6. Test generation, failures, credits, payments, history, and mobile usability.
7. Deploy only after review and explicit release approval.

## Acceptance checklist
- All 20 destinations navigate correctly.
- All 35 tool entries are registered and labelled implemented, unavailable, or planned.
- Each implemented tool has a tool-specific form and output component.
- No broken navigation, duplicate header, mobile overflow, or inert production buttons.
- Only verified models and prices can be submitted.
- Failed jobs follow existing credit-refund rules.
- Saved media and projects persist and reopen correctly.
- Existing production integrations remain unchanged unless separately authorized.
