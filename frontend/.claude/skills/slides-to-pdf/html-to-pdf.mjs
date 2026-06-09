#!/usr/bin/env node
// html-to-pdf.mjs — Convert an HTML slide deck into a print-ready PDF using the
// system Chrome or Edge in headless mode. No npm dependencies, no Chromium
// download. Each printed page becomes one LinkedIn carousel slide, so the HTML
// should size pages with `@page { size: ...; margin: 0 }` and separate slides
// with `page-break-after: always`.
//
// Usage:
//   node html-to-pdf.mjs <input.html> <output.pdf>
//
// Env:
//   CHROME_PATH   Override browser executable (Chrome or Edge).

import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";

const [, , inArg, outArg] = process.argv;
if (!inArg || !outArg) {
  console.error("Usage: node html-to-pdf.mjs <input.html> <output.pdf>");
  process.exit(1);
}

const input = resolve(inArg);
const output = resolve(outArg);

if (!existsSync(input)) {
  console.error(`Input HTML not found: ${input}`);
  process.exit(1);
}
mkdirSync(dirname(output), { recursive: true });

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error(
    "No Chrome or Edge found. Set CHROME_PATH to a browser executable."
  );
  process.exit(1);
}

const url = pathToFileURL(input).href;
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--no-pdf-header-footer",
  "--virtual-time-budget=10000", // let fonts + images settle before printing
  `--print-to-pdf=${output}`,
  url,
];

console.log(`Browser: ${browser}`);
console.log(`Input:   ${input}`);
console.log(`Output:  ${output}`);

const res = spawnSync(browser, args, { stdio: "inherit" });
if (res.status !== 0 || !existsSync(output)) {
  console.error("PDF generation failed.");
  process.exit(res.status || 1);
}
console.log(`OK  PDF written: ${output}`);
