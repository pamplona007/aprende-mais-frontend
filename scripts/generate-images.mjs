#!/usr/bin/env node
// Generates images using the user's image API.
// Reads prompts from image-prompts.json, calls the API for each,
// and saves the resulting URL/buffer to public/images/exercises/.
//
// Usage:
//   1. Put your token in a .env file at the repo root:
//        AVIBI_IMAGE_API_TOKEN=sk-cp-...
//   2. Run:
//        node scripts/generate-images.mjs
//      or to limit scope:
//        node scripts/generate-images.mjs --only ex-coz-1
//      or to skip ones already generated:
//        node scripts/generate-images.mjs --skip-existing
//
// The token never touches chat/logs. The API returns a URL when
// response_format is "url"; we download the image to disk.

import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Config ────────────────────────────────────────────────────────────────
const PROMPTS_FILE = resolve(ROOT, 'image-prompts.json')
const OUTPUT_DIR = resolve(ROOT, 'public/images/exercises')

const API_URL = 'https://api.minimax.io/v1/image_generation'
const API_MODEL = 'image-01'

// 6 in parallel is a sweet spot — the API rate limits around 8-10 concurrent
// requests per account on this tier. Tune down if you hit 429s.
const PARALLEL = 4

// ── CLI args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const onlyIdx = args.indexOf('--only')
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null
const SKIP_EXISTING = args.includes('--skip-existing')

// ── Env loading (minimal — no extra deps) ──────────────────────────────────
// We deliberately avoid dotenv to keep this script dependency-free.
// Just read .env manually for AVIBI_IMAGE_API_TOKEN.
async function loadToken() {
  try {
    const envContent = await readFile(resolve(ROOT, '.env'), 'utf8')
    const match = envContent.match(/^AVIBI_IMAGE_API_TOKEN=(.+)$/m)
    if (match) return match[1].trim()
  } catch {
    // .env missing is fine — we'll fall back to process.env
  }
  return process.env.AVIBI_IMAGE_API_TOKEN || null
}

// ── API call ────────────────────────────────────────────────────────────────
async function generateOne(prompt) {
  const token = await loadToken()
  if (!token) {
    throw new Error(
      'AVIBI_IMAGE_API_TOKEN is not set. Add it to .env or export it before running.',
    )
  }

  const body = {
    model: API_MODEL,
    prompt: prompt.prompt,
    aspect_ratio: prompt.aspect_ratio,
    response_format: 'url',
    n: 1,
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`API ${res.status}: ${errBody.slice(0, 200)}`)
  }

  const data = await res.json()
  // The API response shape (from the user's curl example) is a top-level
  // object whose first image URL we extract. Some providers return
  // `{ data: [{ url: '...' }] }` — we handle both shapes defensively.
  const url =
    data?.data?.[0]?.url ??
    data?.data?.[0]?.image_url ??
    data?.data?.image_urls?.[0] ??
    data?.images?.[0]?.url ??
    data?.image?.url ??
    data?.url
  if (!url) {
    throw new Error(`Unexpected response shape: ${JSON.stringify(data).slice(0, 200)}`)
  }
  return url
}

// ── Download ─────────────────────────────────────────────────────────────────
async function downloadTo(url, destPath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(destPath, buf)
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function exists(path) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function main() {
  const raw = await readFile(PROMPTS_FILE, 'utf8')
  const data = JSON.parse(raw)
  const prompts = data.prompts.filter(
    (p) => !ONLY || p.exercise_id === ONLY,
  )
  if (prompts.length === 0) {
    console.error(`No prompts matched${ONLY ? ` (--only ${ONLY})` : ''}.`)
    process.exit(1)
  }

  await mkdir(OUTPUT_DIR, { recursive: true })

  let done = 0
  let skipped = 0
  let failed = 0
  const failedIds = []

  // Process in chunks of PARALLEL
  for (let i = 0; i < prompts.length; i += PARALLEL) {
    const chunk = prompts.slice(i, i + PARALLEL)
    await Promise.all(
      chunk.map(async (p) => {
        const outPath = join(OUTPUT_DIR, `${p.id}.png`)
        if (SKIP_EXISTING && (await exists(outPath))) {
          skipped++
          console.log(`↷ skip ${p.id}`)
          return
        }
        try {
          const url = await generateOne(p)
          await downloadTo(url, outPath)
          done++
          console.log(`✓ ${p.id}  →  ${outPath.replace(ROOT + '/', '')}`)
        } catch (err) {
          failed++
          failedIds.push(p.id)
          console.error(`✗ ${p.id}: ${err.message}`)
        }
      }),
    )
  }

  console.log(
    `\nDone. ${done} generated, ${skipped} skipped, ${failed} failed.`,
  )
  if (failedIds.length) {
    console.error(`Failed: ${failedIds.join(', ')}`)
    process.exit(2)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
