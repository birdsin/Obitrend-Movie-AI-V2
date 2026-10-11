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
