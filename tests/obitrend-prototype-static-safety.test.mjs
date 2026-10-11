import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(here, "../prototypes/obitrend-v2-structural-prototype.html");
const html = readFileSync(htmlPath, "utf8");
const checklistPath = resolve(here, "../docs/OBITREND-V2-ANDROID-PREVIEW-QA-CHECKLIST.md");
const checklist = readFileSync(checklistPath, "utf8");

test("structural prototype declares exactly 20 primary navigation destinations", () => {
  const match = html.match(/const navItems\s*=\s*\[([\s\S]*?)\n\];/);
  assert.ok(match, "navItems array must exist");
  const entries = match[1].match(/\["[^"]+"/g) || [];
  assert.equal(entries.length, 20);
});

test("structural prototype declares 35 tools with unique IDs", () => {
  const match = html.match(/const tools\s*=\s*\[([\s\S]*?)\n\];/);
  assert.ok(match, "tools array must exist");
  const ids = [...match[1].matchAll(/\bid\s*:\s*["']([^"']+)["']/g)].map((item) => item[1]);
  assert.equal(ids.length, 35);
  assert.equal(new Set(ids).size, 35, "tool IDs must be unique");
});

test("prototype retains the local-only, demo-only safety copy", () => {
  assert.match(html, /not uploaded/i);
  assert.match(html, /demo only/i);
  assert.match(html, /not connected/i);
});

test("prototype source contains no direct network primitives or remote script includes", () => {
  assert.doesNotMatch(html, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /\bXMLHttpRequest\b/);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=/i);
});

test("every registered tool has a complete, valid workspace contract", () => {
  const match = html.match(/const tools\s*=\s*\[([\s\S]*?)\n\];/);
  assert.ok(match, "tools array must exist");
  const objects = [...match[1].matchAll(/\{id:"([^"]+)",name:"([^"]+)",nav:(\d+),icon:"([^"]*)",desc:"([^"]*)",type:"([^"]+)",input:"([^"]+)",output:"([^"]+)",fields:\[([^\]]*)\]\}/g)];
  assert.equal(objects.length, 35, "each tool must use the expected complete record shape");
  for (const [, id, name, nav, , desc, type, input, output, fields] of objects) {
    assert.ok(id && name && desc && output, "tool identity, description, and output label are required");
    assert.ok(Number(nav) >= 0 && Number(nav) < 20, `${id} references a valid navigation destination`);
    assert.ok(["video", "image", "3d", "audio", "text"].includes(type), `${id} has a recognized tool type`);
    assert.ok(["prompt", "text"].includes(input), `${id} has a recognized input mode`);
    assert.ok(fields.trim().length > 0, `${id} has at least one settings field`);
  }
  const navStart = html.indexOf("const navItems=");
  assert.notEqual(navStart, -1, "navItems array must exist");
  const navEnd = html.indexOf("\n];", navStart);
  assert.notEqual(navEnd, -1, "navItems array must terminate");
  const navSource = html.slice(navStart, navEnd);
  const navLabels = navSource.split('["').slice(1).map((item) => item.split('"')[0]);
  assert.equal(navLabels.length, 20);
  for (const [, id, , nav] of objects) {
    assert.ok(navLabels[Number(nav)], `${id} maps to a named navigation destination`);
  }
});

test("workspace actions keep demo generation local and output actions disabled", () => {
  assert.match(html, /No AI request sent/i);
  assert.match(html, /no AI request was sent/i);
  assert.match(html, /\$\("download"\)\.disabled=\$\("save"\)\.disabled=\$\("retry"\)\.disabled=true/);
  assert.match(html, /URL\.createObjectURL\(file\)/);
  assert.match(html, /URL\.revokeObjectURL\(previewObjectUrl\)/);
});

test("mobile navigation has explicit menu toggle and overlay close handlers", () => {
  assert.match(html, /function toggleMenu\(\)/);
  assert.match(html, /\$\("menu"\)\.onclick=toggleMenu/);
  assert.match(html, /aria-expanded/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /e\.key==="Escape"/);
  assert.match(html, /\$\("overlay"\)\.onclick=closeMenu/);
  assert.match(html, /if\(window\.innerWidth<760\)closeMenu\(\)/);
});

test("clear action resets prompt, settings, file selection, and local preview URL", () => {
  assert.match(html, /\$\("clear"\)\.onclick=\(\)=>/);
  assert.match(html, /if\(p\)p\.value=""/);
  assert.match(html, /querySelectorAll\("select"\)\.forEach\(s=>s\.selectedIndex=0\)/);
  assert.match(html, /if\(fileInput\)fileInput\.value=""/);
  assert.match(html, /URL\.revokeObjectURL\(previewObjectUrl\)/);
});

test("each standard sidebar section exposes a demo Generate action and output-panel feedback", () => {
  assert.match(html, /function selectNav\(i\)/);
  assert.match(html, /id='sectionGenerate'/);
  assert.match(html, /\$\("sectionGenerate"\)\.onclick=\(\)=>/);
  assert.match(html, /\$\("preview"\)\.innerHTML=.*output preview/s);
  assert.match(html, /No AI request, upload, project save, or credit deduction occurred/);
});

test("special sections keep explicit demo-only actions and honest integration boundaries", () => {
  assert.match(html, /function renderHistoryPanel\(\)/);
  assert.match(html, /function renderSectionPanel\(i\)/);
  assert.match(html, /Generate \(demo only\)/);
  assert.match(html, /Review history workflow \(demo only\)/);
  assert.match(html, /Live endpoints are not called in this prototype/);
  assert.match(html, /Authenticated backend integration is required/);
});

test("sidebar destinations close the mobile drawer after selection", () => {
  assert.match(html, /if\(window\.innerWidth<760\)closeMenu\(\)/);
  assert.match(html, /function closeMenu\(\)/);
  assert.match(html, /\$\("overlay"\)\.onclick=closeMenu/);
});



test("Android QA checklist keeps the 35-tool matrix and current deployment evidence accurate", () => {
  const matrix = checklist.match(/## Full 35-tool click-through matrix[\s\S]*?(?=\n## |$)/);
  assert.ok(matrix, "the full tool click-through matrix must exist");
  const rows = [...matrix[0].matchAll(/^\|\s*\d+\s*\|/gm)];
  assert.equal(rows.length, 35, "the manual QA matrix must list all 35 tools");
  assert.match(checklist, /Latest checked READY deployment source commit: \`7c6b21cad8c16418f19a8f5b3ab9fbaf3900ea7c\`/);
  assert.match(checklist, /newer source changes are not confirmed deployed/i);
  assert.match(checklist, /not a runtime network capture/i);
});

test("Movie Creator opens the three-step local-only project workflow", () => {
  assert.match(html, /if\(i===1\)\{renderMovieWorkflow\(\)\}/);
  assert.match(html, /function renderMovieWorkflow\(\)/);
  assert.match(html, /Project setup/);
  assert.match(html, /Story &amp; script|Story & script/);
  assert.match(html, /Scene breakdown/);
  assert.match(html, /function captureMovieStep\(\)/);
  assert.match(html, /function updateMovieTotal\(\)/);
});

test("movie workflow labels reviews as demo-only and keeps generated-output actions disabled", () => {
  assert.match(html, /LOCAL DRAFT · DEMO ONLY/);
  assert.match(html, /No AI request, upload, save, or credit deduction occurred/);
  assert.match(html, /\$\("download"\)\.disabled=\$\("save"\)\.disabled=\$\("retry"\)\.disabled=true/);
  assert.match(html, /No actual generation or account save is connected/);
});

test("movie workflow preserves current inputs when switching steps and renders a detailed plan review", () => {
  assert.match(html, /captureMovieStep\(\);movieDraft\.step=Number\(b\.dataset\.movieStep\);renderMovieWorkflow\(\)/);
  assert.match(html, /Project name/);
  assert.match(html, /Story title/);
  assert.match(html, /Scene breakdown · /);
  assert.match(html, /Total estimated scene duration/);
  assert.match(html, /escMovie\(sc\.description\|\|"No scene description entered\."\)/);
  assert.match(html, /This is a plan summary, not a generated movie/);
});

test("movie draft uses tab-scoped session persistence with explicit restore and clear controls", () => {
  assert.match(html, /const MOVIE_DRAFT_KEY="obitrend-v2-movie-draft-session"/);
  assert.match(html, /sessionStorage\.setItem\(MOVIE_DRAFT_KEY,JSON\.stringify\(movieDraft\)\)/);
  assert.match(html, /sessionStorage\.getItem\(MOVIE_DRAFT_KEY\)/);
  assert.match(html, /sessionStorage\.removeItem\(MOVIE_DRAFT_KEY\)/);
  assert.match(html, /restoreMovieDraftSession\(\);renderNav\(\)/);
  assert.match(html, /SESSION DRAFT · DEMO ONLY/);
  assert.match(html, /Clear entire movie draft/);
  assert.doesNotMatch(html, /localStorage\.(?:setItem|getItem)\(/);
  assert.doesNotMatch(html, /\bfetch\s*\(/);
});
