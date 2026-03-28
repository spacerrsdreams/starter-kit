import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

function run(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      ...options,
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

const DEFAULT_REPO =
  process.env.CREATE_STARTER_KIT_REPO ??
  "https://github.com/spacerrsdreams/starter-kit.git";

const DEFAULT_BRANCH = process.env.CREATE_STARTER_KIT_BRANCH ?? "main";

/**
 * @returns {Promise<string>} absolute path to cloned repo root (working tree)
 */
export async function shallowCloneStarter() {
  const cloneRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "create-starter-kit-app-"),
  );
  await run(
    "git",
    [
      "clone",
      "--depth",
      "1",
      "--branch",
      DEFAULT_BRANCH,
      DEFAULT_REPO,
      cloneRoot,
    ],
    { cwd: path.dirname(cloneRoot) },
  );
  return cloneRoot;
}

/**
 * @param {string} cloneRoot
 */
export async function removeCloneWorkdir(cloneRoot) {
  const baseName = path.basename(cloneRoot);
  if (!baseName.startsWith("create-starter-kit-app-")) return;
  await fs.rm(cloneRoot, { recursive: true, force: true });
}
