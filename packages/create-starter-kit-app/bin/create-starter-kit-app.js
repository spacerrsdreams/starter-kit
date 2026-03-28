#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import prompts from "prompts";
import { copyStarterTree } from "../lib/copy-starter.mjs";
import {
  shallowCloneStarter,
  removeCloneWorkdir,
} from "../lib/clone-repo.mjs";
import {
  assertDirectoryEmptyOrAbsent,
  DEFAULT_PROJECT,
  pathExists,
  resolveProjectPath,
} from "../lib/paths.mjs";

function printHelp() {
  console.log(`
Usage:
  npx create-starter-kit-app [project-path]

  project-path   Relative path, absolute path, or "." for the current directory.
                 Default when prompted: ${DEFAULT_PROJECT}

Environment:
  CREATE_STARTER_KIT_REPO       Git URL to clone (default: spacerrsdreams/starter-kit)
  CREATE_STARTER_KIT_BRANCH     Branch to clone (default: main)
  CREATE_STARTER_KIT_LOCAL_ROOT Use this folder as the template instead of cloning
                                (no network; for maintainers testing before publish)
`);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  const cwd = process.cwd();
  let rawPath = argv.find((a) => !a.startsWith("-"));

  if (rawPath === undefined) {
    const answer = await prompts({
      type: "text",
      name: "path",
      message: "Project path (use . for current folder)",
      initial: DEFAULT_PROJECT,
    });
    if (answer.path === undefined) {
      process.exit(0);
    }
    rawPath = String(answer.path);
  }

  const targetDir = resolveProjectPath(rawPath, cwd);

  try {
    await assertDirectoryEmptyOrAbsent(targetDir);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }

  const exists = await pathExists(targetDir);
  if (!exists) {
    await fs.mkdir(targetDir, { recursive: true });
  }

  const localRoot = process.env.CREATE_STARTER_KIT_LOCAL_ROOT;
  let sourceRoot;
  let cleanup = async () => {};

  if (localRoot && localRoot.trim() !== "") {
    sourceRoot = path.resolve(localRoot.trim());
    const ok = await pathExists(sourceRoot);
    if (!ok) {
      console.error(`CREATE_STARTER_KIT_LOCAL_ROOT does not exist:\n  ${sourceRoot}`);
      process.exit(1);
    }
  } else {
    try {
      sourceRoot = await shallowCloneStarter();
      cleanup = async () => {
        await removeCloneWorkdir(sourceRoot);
      };
    } catch (err) {
      console.error(
        "Failed to fetch starter template. Ensure git is installed and you can reach the repo.",
      );
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }
  }

  try {
    await copyStarterTree(sourceRoot, targetDir);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    await cleanup();
  }

  console.log(`\nCreated starter-kit at:\n  ${targetDir}\n`);
  console.log("Next:");
  console.log(`  cd ${path.relative(cwd, targetDir) || "."}`);
  console.log("  cp .env.example .env.local   # then edit values");
  console.log("  bun install");
  console.log("  bun run dev\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
