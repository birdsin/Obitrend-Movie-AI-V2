#!/usr/bin/env node
/**
 * Static safety checks for the standalone Creator Studio prototype.
 * Run: node scripts/check-studio-v2.mjs
 * This is not a browser or end-to-end test.
 */
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const html = readFileSync(new URL('../studio-v2.html', import.meta.url), 'utf8');
const groupsMatch = html.match(/const groups=\[(.*?)\];\nconst catalog=/s);
assert.ok(groupsMatch, 'Tool catalogue declaration should exist');
const tools = [...groupsMatch[1].matchAll(/\["([^"]+)","([^"]+)","([^"]+)"\]/g)];
assert.equal(tools.length, 35, `Expected 35 tool definitions; found ${tools.length}`);
const names = tools.map(([_, name]) => name);
assert.equal(new Set(names).size, names.length, 'Tool names should be unique');

for (const locale of ['en','fr','es','pt','ar','hi','zh','ja','ko','yo','ig','ha']) {
  assert.match(html, new RegExp('(^|[,{])\\s*' + locale + ':\\{'), `Missing locale dictionary: ${locale}`);
}
assert.match(html, /document\.documentElement\.dir=locale==='ar'\?'rtl':'ltr'/, 'Arabic should set RTL direction');
assert.match(html, /id="toolScreen"[\s\S]*?button class="primary full" disabled/, 'Generation must remain disabled until backend setup');
assert.match(html, /authentication and recovery are not connected yet/i, 'Authentication limitation must be visible');
assert.match(html, /prefers-reduced-motion:reduce/, 'Reduced-motion preference should be respected');
assert.match(html, /Passwords do not match/, 'Signup should validate matching passwords');
assert.match(html, /sessionStorage\.setItem\('obitrendIntroSeen'/, 'Intro skip preference should be session-scoped');

console.log('Creator Studio static checks passed.');
console.log(`Verified ${tools.length} unique tools, 12 locale dictionaries, RTL direction, disabled generation, and key safety affordances.`);
console.log('Note: browser rendering, full translation coverage, authentication, and AI generation are not tested by this script.');
