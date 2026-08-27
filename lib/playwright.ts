import fs from "fs";
import path from "path";
import { spawn } from "child_process";

// Write the generated test to a temp .mjs file and run it with node.
// Playwright resolves from the project's node_modules.
export async function runTest(
  testCode: string,
  cwd: string
): Promise<{ passed: boolean; output: string }> {
  const file = path.join(cwd, "repro-" + Date.now() + ".mjs");
  fs.writeFileSync(file, testCode);
  try {
    const out = await new Promise<string>((resolve, reject) => {
      const proc = spawn("node", [file], { cwd });
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
