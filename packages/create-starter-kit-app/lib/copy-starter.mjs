import fs from "node:fs/promises"
import path from "node:path"

const SKIP_DIR_NAMES = new Set([
  ".git",
  "node_modules",
  ".next",
  "out",
  "build",
  "coverage",
  ".vercel",
  "dist",
  "showcase",
])

const SKIP_DIR_PREFIXES = ["packages/create-starter-kit-app"]

function shouldSkipDir(relPosix) {
  if (relPosix === ".cursor" || relPosix.startsWith(".cursor/")) {
    return true
  }
  const segments = relPosix.split("/").filter(Boolean)
  const name = segments[segments.length - 1]
  if (name && SKIP_DIR_NAMES.has(name)) return true
  for (const prefix of SKIP_DIR_PREFIXES) {
    if (relPosix === prefix || relPosix.startsWith(`${prefix}/`)) return true
  }
  if (relPosix === "src/generated" || relPosix.startsWith("src/generated/")) {
    return true
  }
  return false
}

function shouldSkipFile(relPosix, baseName) {
  if (baseName === ".DS_Store") return true
  if (baseName.endsWith(".tsbuildinfo")) return true
  if (baseName === "next-env.d.ts") return true
  if (baseName.startsWith(".env") && baseName !== ".env.example") return true
  return false
}

/**
 * @param {string} sourceRoot
 * @param {string} destRoot
 */
export async function copyStarterTree(sourceRoot, destRoot) {
  async function walk(rel = "") {
    const absSource = path.join(sourceRoot, rel)
    const entries = await fs.readdir(absSource, { withFileTypes: true })

    for (const ent of entries) {
      const name = ent.name
      const childRel = rel ? path.join(rel, name) : name
      const childPosix = childRel.split(path.sep).join("/")

      if (ent.isSymbolicLink()) {
        continue
      }

      if (ent.isDirectory()) {
        if (shouldSkipDir(childPosix)) continue
        const absDest = path.join(destRoot, childRel)
        await fs.mkdir(absDest, { recursive: true })
        await walk(childRel)
        continue
      }

      if (ent.isFile()) {
        if (shouldSkipFile(childPosix, name)) continue
        const absDest = path.join(destRoot, childRel)
        await fs.mkdir(path.dirname(absDest), { recursive: true })
        await fs.copyFile(path.join(absSource, name), absDest)
      }
    }
  }

  await walk("")
}
