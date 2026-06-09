#!/usr/bin/env node
// Generate a single image with the Black Forest Labs (FLUX) API and save it to disk.
//
// Usage:
//   node bfl-generate.mjs --prompt "..." --out public/images/news/slug-header.jpg \
//        [--width 1344] [--height 768] [--model flux-pro-1.1] [--seed 12345]
//
// Reads BFL_API_KEY from the environment, falling back to frontend/.env.local.
// Exits non-zero with a clear message on any failure.

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

// ---- arg parsing -----------------------------------------------------------
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    if (!key?.startsWith("--")) continue;
    args[key.slice(2)] = argv[i + 1];
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const prompt = args.prompt;
const out = args.out;
const width = Number(args.width ?? 1344);
const height = Number(args.height ?? 768);
const model = args.model ?? "flux-pro-1.1";
const seed = args.seed ? Number(args.seed) : undefined;

if (!prompt || !out) {
  console.error("Error: --prompt and --out are required.");
  process.exit(2);
}
// BFL requires width/height to be multiples of 32, between 256 and 1440.
for (const [name, v] of [["width", width], ["height", height]]) {
  if (Number.isNaN(v) || v % 32 !== 0 || v < 256 || v > 1440) {
    console.error(`Error: --${name} must be a multiple of 32 between 256 and 1440 (got ${v}).`);
    process.exit(2);
  }
}

// ---- resolve API key -------------------------------------------------------
async function resolveApiKey() {
  if (process.env.BFL_API_KEY) return process.env.BFL_API_KEY.trim();
  const envPath = resolve(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    const text = await readFile(envPath, "utf8");
    const match = text.match(/^\s*BFL_API_KEY\s*=\s*(.+)\s*$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

const apiKey = await resolveApiKey();
if (!apiKey) {
  console.error(
    "Error: BFL_API_KEY not found. Add it to frontend/.env.local as:\n" +
      "  BFL_API_KEY=your-key-here\n" +
      "Get a key at https://dashboard.bfl.ai/"
  );
  process.exit(3);
}

const BASE = "https://api.bfl.ai";

// ---- submit generation request --------------------------------------------
async function submit() {
  const res = await fetch(`${BASE}/v1/${model}`, {
    method: "POST",
    headers: {
      "x-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      prompt,
      width,
      height,
      output_format: "jpeg",
      safety_tolerance: 2,
      prompt_upsampling: false,
      ...(seed !== undefined ? { seed } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Submit failed (${res.status}): ${body}`);
  }
  const json = await res.json();
  if (!json.polling_url) throw new Error(`No polling_url in response: ${JSON.stringify(json)}`);
  return json.polling_url;
}

// ---- poll until ready ------------------------------------------------------
async function poll(pollingUrl) {
  const deadline = Date.now() + 120_000; // 2 min budget
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    const res = await fetch(pollingUrl, {
      headers: { "x-key": apiKey, accept: "application/json" },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Poll failed (${res.status}): ${body}`);
    }
    const json = await res.json();
    switch (json.status) {
      case "Ready":
        if (!json.result?.sample) throw new Error("Ready but no result.sample URL.");
        return json.result.sample;
      case "Pending":
      case "Processing":
      case "Queued":
        process.stderr.write(".");
        break;
      case "Content Moderated":
      case "Request Moderated":
        throw new Error(`Generation blocked by content moderation (status: ${json.status}). Revise the prompt.`);
      default:
        throw new Error(`Generation failed (status: ${json.status}): ${JSON.stringify(json)}`);
    }
  }
  throw new Error("Timed out waiting for image (120s).");
}

// ---- download --------------------------------------------------------------
async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}).`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(resolve(dest)), { recursive: true });
  await writeFile(resolve(dest), buf);
  return buf.length;
}

// ---- run -------------------------------------------------------------------
try {
  console.error(`Generating ${width}x${height} with ${model} -> ${out}`);
  const pollingUrl = await submit();
  const sampleUrl = await poll(pollingUrl);
  const bytes = await download(sampleUrl, out);
  console.error(`\nSaved ${out} (${Math.round(bytes / 1024)} KB)`);
  console.log(out);
} catch (err) {
  console.error(`\n${err.message}`);
  process.exit(1);
}
