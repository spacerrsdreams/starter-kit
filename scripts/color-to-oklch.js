#!/usr/bin/env node
/**
 * Convert CSS color strings (hex, rgb, hsl, oklch, named colors, etc.) to oklch()
 * for design tokens. Uses culori’s OKLCH conversion (same as browser-relative color).
 *
 * Usage:
 *   node scripts/color-to-oklch.js <color> [color ...]
 *   bun run color:to-oklch -- "#466cf3" "hsl(234, 10.87%, 18.04%)"
 *
 * Stdin (one color per line):
 *   echo -e "#fff\nrgb(24,24,24)" | node scripts/color-to-oklch.js
 *
 * Options:
 *   --no-label   With multiple colors, print only oklch() lines (no "input ->").
 *   --help       Show this help.
 */

const { converter, formatCss, parse } = require("culori")

const toOklch = converter("oklch")

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = []
    process.stdin.setEncoding("utf8")
    process.stdin.on("data", (c) => chunks.push(c))
    process.stdin.on("end", () => resolve(chunks.join("")))
    process.stdin.on("error", reject)
  })
}

/** Round L/C/H for stable, paste-friendly tokens; preserve alpha as-is. */
function roundOklchCss(css) {
  const m = css.match(/^oklch\(\s*([^)]+)\s*\)$/i)
  if (!m) return css
  let inner = m[1].trim()
  let alpha = ""
  const slash = inner.indexOf(" / ")
  if (slash !== -1) {
    alpha = inner.slice(slash)
    inner = inner.slice(0, slash).trim()
  }
  const parts = inner.split(/\s+/)
  if (parts.length < 3) return css

  function roundToken(token, decimals) {
    if (token.endsWith("%")) {
      const n = Number.parseFloat(token)
      if (Number.isNaN(n)) return token
      return `${Number(n.toFixed(4))}%`
    }
    const n = Number.parseFloat(token)
    if (Number.isNaN(n)) return token
    return String(Number(n.toFixed(decimals)))
  }

  const l = roundToken(parts[0], 6)
  const c = roundToken(parts[1], 6)
  const h = roundToken(parts[2], 3)
  const core = `${l} ${c} ${h}`
  return alpha ? `oklch(${core}${alpha})` : `oklch(${core})`
}

function colorToOklchCss(input) {
  const trimmed = input.trim()
  if (!trimmed) return null
  const parsed = parse(trimmed)
  if (!parsed) return null
  const ok = toOklch(parsed)
  if (!ok) return null
  let css = formatCss(ok)
  css = css.replace(/\bnone\b/gi, "0")
  return roundOklchCss(css)
}

async function main() {
  const raw = process.argv.slice(2)
  if (raw.includes("--help") || raw.includes("-h")) {
    console.log(`Convert colors to oklch().

Usage:
  node scripts/color-to-oklch.js <color> [color ...]
  echo "<color>" | node scripts/color-to-oklch.js

Options:
  --no-label   Multiple inputs: print only oklch() values
`)
    process.exit(0)
  }

  const noLabel = raw.includes("--no-label")
  const args = raw.filter((a) => a !== "--no-label")

  let inputs = args
  if (inputs.length === 0) {
    const text = await readStdin()
    inputs = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
  }

  if (inputs.length === 0) {
    console.error(
      "Error: pass at least one color, or pipe lines on stdin.\nExample: node scripts/color-to-oklch.js '#466cf3'"
    )
    process.exit(1)
  }

  const single = inputs.length === 1

  for (const line of inputs) {
    const out = colorToOklchCss(line)
    if (!out) {
      console.error(`Invalid color: ${line}`)
      process.exitCode = 1
      continue
    }
    if (single) {
      console.log(out)
    } else if (noLabel) {
      console.log(out)
    } else {
      console.log(`${line} -> ${out}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
