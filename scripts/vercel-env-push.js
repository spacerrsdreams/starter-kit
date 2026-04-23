#!/usr/bin/env node
/**
 * Push all variables from a .env file to Vercel environment(s).
 * Usage: node scripts/vercel-env-push.js <env-file> <environment> [environment ...] [--var VARIABLE_NAME]
 * Example: node scripts/vercel-env-push.js .env.development preview
 * Example: node scripts/vercel-env-push.js .env.production production
 * Example: node scripts/vercel-env-push.js .env.production production --var DATABASE_URL
 * Environments: development | preview | production
 */

const { spawnSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const VALID_ENVS = new Set(["development", "preview", "production"])

function parseEnvFile(filePath) {
  const resolved = path.resolve(process.cwd(), filePath)
  if (!fs.existsSync(resolved)) {
    console.error(`Error: File not found: ${resolved}`)
    process.exit(1)
  }
  const content = fs.readFileSync(resolved, "utf-8")
  const vars = []
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!key) continue
    vars.push([key, value])
  }
  return vars
}

function pushVar(key, value, env) {
  const result = spawnSync("vercel", ["env", "add", key, env, "--force", "--yes"], {
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
    encoding: "utf-8",
  })
  return result.status === 0
}

function main() {
  const rawArgs = process.argv.slice(2)
  const varIdx = rawArgs.indexOf("--var")
  const singleVar = varIdx !== -1 ? rawArgs[varIdx + 1] : null
  const args = varIdx === -1 ? rawArgs : [...rawArgs.slice(0, varIdx), ...rawArgs.slice(varIdx + 2)]

  if (args.length < 2) {
    console.error("Usage: env:push <env-file> <environment> [environment ...] [--var VARIABLE_NAME]")
    console.error("Example: env:push .env.development preview")
    console.error("Example: env:push .env.production production")
    console.error("Example: env:push .env.production production --var DATABASE_URL")
    console.error("Environments: development | preview | production")
    process.exit(1)
  }

  const [fileArg, ...envArgs] = args
  const environments = [...new Set(envArgs)]

  for (const env of environments) {
    if (!VALID_ENVS.has(env)) {
      console.error(`Error: Invalid environment "${env}". Use: development | preview | production`)
      process.exit(1)
    }
  }

  let vars = parseEnvFile(fileArg)
  if (singleVar) {
    vars = vars.filter(([key]) => key === singleVar)
    if (vars.length === 0) {
      console.error(`Error: Variable "${singleVar}" not found in ${fileArg}`)
      process.exit(1)
    }
    console.log(`Pushing 1 variable "${singleVar}" from ${fileArg} to: ${environments.join(", ")}\n`)
  } else {
    if (vars.length === 0) {
      console.error("No variables found in", fileArg)
      process.exit(1)
    }
    console.log(`Pushing ${vars.length} variable(s) from ${fileArg} to: ${environments.join(", ")}\n`)
  }

  let failed = 0
  for (const [key, value] of vars) {
    for (const env of environments) {
      const ok = pushVar(key, value, env)
      if (ok) {
        console.log(`  ✓ ${key} → ${env}`)
      } else {
        console.error(`  ✗ ${key} → ${env}`)
        failed++
      }
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} push(es) failed. Ensure 'vercel' CLI is installed and you're linked (vercel link).`)
    process.exit(1)
  }
  console.log("\nDone.")
}

main()
