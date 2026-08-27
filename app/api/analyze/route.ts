import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { extractFrames, frameToDataUrl, tmpDir } from "@/lib/frames";
import { analyzeVideo, generateTest, generatePatch, isDemo } from "@/lib/openai";
import { runTest } from "@/lib/playwright";
import { applyPatch, readRepo } from "@/lib/patch";
import { AnalysisResult } from "@/lib/types";

export const dynamic = "force-dynamic";

function resolveTarget(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("file://")) {
    const p = raw.replace("file://", "");
    return "file://" + path.resolve(p.startsWith("./") ? p.slice(2) : p);
  }
  if (raw.startsWith("./")) return "file://" + path.resolve(raw.slice(2));
  return raw;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("video") as File | null;
    const repoArg =
      (form.get("repo") as string) || process.env.TARGET_REPO || "./sample-app";
    const urlArg =
      (form.get("targetUrl") as string) ||
      process.env.TARGET_URL ||
      "file://./sample-app/index.html";
    const targetUrl = resolveTarget(urlArg);
    const repoDir = path.resolve(repoArg);

    if (!file) {
      return NextResponse.json({ error: "No video uploaded" }, { status: 400 });
    }

    const workDir = path.resolve(process.cwd());
    const tmp = tmpDir();
    const videoPath = path.join(tmp, "video" + path.extname(file.name || ".mp4"));
    fs.writeFileSync(videoPath, Buffer.from(await file.arrayBuffer()));

    const framePaths = await extractFrames(videoPath, path.join(tmp, "frames"), 8);
    const frames = framePaths.map(frameToDataUrl);

    const analysis = await analyzeVideo(framePaths);
    const testCode = await generateTest(analysis, targetUrl);

    const firstRun = await runTest(testCode, workDir);
    let patchResult = null;
    let rerun = null;

    if (!firstRun.passed) {
      const repoFiles = readRepo(repoDir);
      const files = await generatePatch({
        failureOutput: firstRun.output,
        targetUrl,
        repoFiles,
      });
      if (files.length) {
        patchResult = applyPatch(repoDir, files);
        rerun = await runTest(testCode, workDir);
      }
    }

    const result: AnalysisResult = {
      demo: isDemo,
      frames,
      summary: analysis.summary,
      reproSteps: analysis.reproSteps,
      expectedBehavior: analysis.expectedBehavior,
      testCode,
      testRun: firstRun,
      patch: patchResult,
      rerun,
      prUrl: null,
    };

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
