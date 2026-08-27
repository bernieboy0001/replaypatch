import ffmpegPath from "ffmpeg-static";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Extract up to `count` evenly spaced frames from a video using the bundled
// static ffmpeg binary (no system install required).
export async function extractFrames(
  videoPath: string,
  outDir: string,
  count = 8
): Promise<string[]> {
  fs.mkdirSync(outDir, { recursive: true });
  const fps = `1/${Math.max(1, Math.round(count / 2))}`;
  const outPattern = path.join(outDir, "frame-%03d.png");

  await new Promise<void>((resolve, reject) => {
    const proc = spawn(String(ffmpegPath), [
      "-i",
      videoPath,
      "-vf",
      `fps=${fps}`,
      "-frames:v",
      String(count),
      outPattern,
    ]);
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code !== 0 && code !== null) {
        reject(new Error("ffmpeg failed: " + stderr.slice(-500)));
      } else {
        resolve();
      }
    });
  });

  return fs
    .readdirSync(outDir)
    .filter((f) => f.startsWith("frame-") && f.endsWith(".png"))
    .sort()
    .map((f) => path.join(outDir, f));
}

export function frameToDataUrl(framePath: string): string {
  const b64 = fs.readFileSync(framePath).toString("base64");
  return `data:image/png;base64,${b64}`;
}

export function tmpDir(prefix = "replaypatch"): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix + "-"));
}
