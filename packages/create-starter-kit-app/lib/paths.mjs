import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_PROJECT = "starter-kit-app";

/**
 * @param {string} raw
 * @param {string} cwd
 */
export function resolveProjectPath(raw, cwd) {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "." || trimmed === "./") {
    return cwd;
  }
  if (path.isAbsolute(trimmed)) {
    return path.normalize(trimmed);
  }
  return path.resolve(cwd, trimmed);
}

/**
 * @param {string} dir
 * @returns {Promise<boolean>}
 */
export async function pathExists(dir) {
  try {
    await fs.access(dir);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} dir
 * @returns {Promise<boolean>}
 */
export async function isDirectoryEmpty(dir) {
  const entries = await fs.readdir(dir);
  return entries.length === 0;
}

/**
 * @param {string} dir
 */
export async function assertDirectoryEmptyOrAbsent(dir) {
  const exists = await pathExists(dir);
  if (!exists) return;
  const empty = await isDirectoryEmpty(dir);
  if (!empty) {
    throw new Error(
      `Target is not empty — refusing to write files.\n  ${dir}\nRemove files or choose another path.`,
    );
  }
}

export { DEFAULT_PROJECT };
