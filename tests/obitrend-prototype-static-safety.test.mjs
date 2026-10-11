import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(here, "../prototypes/obitrend-v2-structural-prototype.html");
const html = readFileSync(htmlPath, "utf8");

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
  const navEnd = html.indexOf("\\n];", navStart);
  assert.notEqual(navEnd, -1, "navItems array must terminate");
  const navSource = html.slice(navStart, navEnd);
  const navLabels = [...navSource.matchAll(/\\["([^"]+)"/g)].map((item) => item[1]);
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
  assert.match(html, /\$\("menu"\)\.onclick=\(\)=>/);
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
