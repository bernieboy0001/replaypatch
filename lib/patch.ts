import fs from "fs";
import path from "path";

export interface PatchResult {
  path: string;
  before: string;
  after: string;
}

// Apply generated file contents inside the target repo. Returns before/after
// for diff display. Only writes files that already exist (no arbitrary creation).
export function applyPatch(
  repoDir: string,
  files: { path: string; content: string }[]
): PatchResult[] {
  const results: PatchResult[] = [];
  for (const f of files) {
    const abs = path.resolve(repoDir, f.path);
    const before = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : "";
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, f.content);
    results.push({ path: f.path, before, after: f.content });
  }
  return results;
}

// Read all text files in the repo so the model can see source context.
export function readRepo(repoDir: string, maxBytes = 200000): { path: string; content: string }[] {
  const out: { path: string; content: string }[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        walk(p);
      } else if (/\.(js|ts|jsx|tsx|html|css|json)$/.test(entry.name)) {
        const content = fs.readFileSync(p, "utf8");
        if (content.length <= maxBytes) {
          out.push({ path: path.relative(repoDir, p), content });
        }
      }
    }
  };
  try {
    walk(repoDir);
  } catch {}
  return out;
}
