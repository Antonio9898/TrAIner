// @ts-check
import process from "node:process";
import { readFileSync, existsSync, realpathSync } from "node:fs";
import { dirname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2];

try {
  if (mode !== "lint" && mode !== "typecheck") throw new Error("Expected lint or typecheck");
  /** @type {{ tool_name?: string, cwd?: string, tool_input?: { command?: string } }} */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Hook JSON comes from Codex; fields used below are checked before execution.
  const event = JSON.parse(readFileSync(0, "utf8"));
  if (event.tool_name !== "apply_patch") process.exit(0);
  const patch = event.tool_input?.command;
  if (typeof patch !== "string") throw new Error("Missing apply_patch tool_input.command");

  // Codex sends one patch, potentially containing multiple files and renames.
  const paths = [...patch.matchAll(/^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+)$/gm)].map((match) =>
    resolve(event.cwd ?? root, match[1].trim()),
  );
  const files = [...new Set(paths)].filter((file) => {
    const local = relative(root, existsSync(file) ? realpathSync(file) : file);
    return (
      !isAbsolute(local) &&
      !local.startsWith("../") &&
      !/^(?:context\/archive|node_modules|dist|\.astro|\.wrangler)\//.test(local) &&
      /\.(?:[cm]?[jt]sx?|astro)$/.test(local)
    );
  });
  const typeConfigChanged = paths.some((file) => /^(?:tsconfig.*\.json|package\.json)$/.test(relative(root, file)));
  if (files.length === 0 && !(mode === "typecheck" && typeConfigChanged)) process.exit(0);

  const existing = files.filter((file) => existsSync(file));
  if (mode === "lint" && existing.length === 0) process.exit(0);
  const binary = mode === "lint" ? "eslint/bin/eslint.js" : "astro/bin/astro.mjs";
  const args = mode === "lint" ? ["--", ...existing] : ["check"];
  const started = Date.now();
  const result = spawnSync(process.execPath, [resolve(root, "node_modules", binary), ...args], {
    cwd: root,
    encoding: "utf8",
    timeout: 45000,
    maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, NO_COLOR: "1" },
  });
  const duration = ((Date.now() - started) / 1000).toFixed(1);
  if (result.error || result.status !== 0) {
    process.stderr.write(
      `[Codex ${mode}] FAILED (${duration}s)\n${result.stdout}${result.stderr}${result.error?.message ?? ""}\n`,
    );
    process.exit(2);
  }
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: `[Codex ${mode}] OK (${duration}s).`,
      },
    }) + "\n",
  );
} catch (error) {
  process.stderr.write(`[Codex ${mode}] ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(2);
}
