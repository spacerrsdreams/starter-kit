#!/usr/bin/env node

const { spawn } = require("node:child_process")

const ngrokUrl = process.env.NGROK_URL
const cliPort = process.argv[2]
const port = cliPort || process.env.PORT || "3000"

if (!ngrokUrl) {
  console.error("Missing NGROK_URL. Set it in your env file.")
  process.exit(1)
}

const child = spawn("ngrok", ["http", `--url=${ngrokUrl}`, port], {
  stdio: "inherit",
})

child.on("exit", (code) => {
  process.exit(code ?? 0)
})

child.on("error", (error) => {
  console.error("Failed to start ngrok:", error.message)
  process.exit(1)
})
