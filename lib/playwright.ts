import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";

// Scripted run outputs used on serverless (Vercel) demo mode, where a ~300MB
// chromium binary cannot ship inside the function. When `simulated` is set,
// runTest skips the real browser (unavailable there) and returns these fixtures.
export const DEMO_FIRST_RUN = [
  "> repro-1138.mjs",
  "  1) Repro click #openBtn expects #modal to be visible",
  "     element does not have expected visibility (element hidden)",
  "     at file:///var/task/sample-app/index.html",
  "",
  "  TimeoutError: Timeout 5000ms exceeded — waitForSelector('#modal:visible')",
  "  while waiting for expected conditions",
  "",
  "[1m0s] 0 passed, 1 failed",
  "[exit 1]",
].join("\n");
export const DEMO_RERUN = [
  "> repro-1139.mjs",
  "  ✓ click #openBtn opens #modal",
  "  ✓ modal becomes visible after patch (display:block)",
  "",
  "[1m0s] 2 passed (1.4s)",
  "REPLAYPATCH_PASS",
  "[exit 0]",
].join("\n");

// Write the generated test to a temp .mjs file and run it with node.
// Playwright resolves from the project's node_modules.
export async function runTest(
  testCode: string,
  cwd: string,
  simulated?: string
): Promise<{ passed: boolean; output: string }> {
  if (simulated !== undefined) {
    const passed = /REPLAYPATCH_PASS/.test(simulated) && !/REPLAYPATCH_FAIL/.test(simulated);
    return { passed, output: simulated };
  }
  let writeDir = cwd;
  try {
    fs.writeFileSync(path.join(cwd, ".rp-write-test"), "1");
    fs.unlinkSync(path.join(cwd, ".rp-write-test"));
  } catch {
    writeDir = fs.mkdtempSync(path.join(os.tmpdir(), "repro-"));
  }
  const file = path.join(writeDir, "repro-" + Date.now() + ".mjs");
  fs.writeFileSync(file, testCode);
  try {
    const out = await new Promise<string>((resolve, reject) => {
      const proc = spawn("node", [file], { cwd: writeDir });
      let buf = "";
      proc.stdout.on("data", (d) => (buf += d.toString()));
      proc.stderr.on("data", (d) => (buf += d.toString()));
      proc.on("error", reject);
      proc.on("close", (code) => resolve(buf + `\n[exit ${code}]`));
    });
    const passed = /REPLAYPATCH_PASS/.test(out) && !/REPLAYPATCH_FAIL/.test(out);
    return { passed, output: out.trim().slice(-2000) };
  } catch (e: any) {
    return { passed: false, output: String(e?.message || e) };
  } finally {
    try {
      fs.unlinkSync(file);
    } catch {}
  }
}
