import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { extractFrames, frameToDataUrl, tmpDir } from "../../../lib/frames";
import { analyzeVideo, generateTest, generatePatch, isDemo } from "../../../lib/openai";
import { runTest, DEMO_FIRST_RUN, DEMO_RERUN } from "../../../lib/playwright";
import { applyPatch, readRepo } from "../../../lib/patch";
import { AnalysisResult } from "../../../lib/types";
import { uploadToOGStorage, reportToChain, verifyOnChain, isOGConfigured, OG_EXPLORER } from "../../../lib/0g";

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

// Copy a folder recursively (skipping heavy dirs) so patching happens on a
// writable sandbox. The serverless filesystem is read-only, so we cannot patch
// ./sample-app in place on Vercel.
function copyRepo(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRepo(from, to);
    else fs.copyFileSync(from, to);
  }
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
    const workDir = path.resolve(process.cwd());
    const tmp = tmpDir();

    // Patch the repo in a writable sandbox (serverless fs is read-only).
    const srcRepo = path.resolve(repoArg);
    const sandboxRepo = path.join(tmp, "sandbox");
    let repoDir = srcRepo;
    let targetUrl = resolveTarget(urlArg);
    if (fs.existsSync(srcRepo)) {
      copyRepo(srcRepo, sandboxRepo);
      repoDir = sandboxRepo;
      if (urlArg.includes("./sample-app")) {
        targetUrl = "file://" + path.join(sandboxRepo, "index.html");
      }
    }

    if (!file) {
      return NextResponse.json({ error: "No video uploaded" }, { status: 400 });
    }

    const videoPath = path.join(tmp, "video" + path.extname(file.name || ".mp4"));
    fs.writeFileSync(videoPath, Buffer.from(await file.arrayBuffer()));

    // ── 0G Storage: upload the bug recording ──────────────────────────────────
    let recordingHash = "";
    if (isOGConfigured()) {
      try { recordingHash = await uploadToOGStorage(videoPath); } catch {}
    }

    const framePaths = await extractFrames(videoPath, path.join(tmp, "frames"), 8);
    const frames = framePaths.map(frameToDataUrl);

    const analysis = await analyzeVideo(framePaths);
    const testCode = await generateTest(analysis, targetUrl);

    // On serverless (Vercel) demo mode the chromium binary can't ship inside
    // the function, so we use scripted run outputs. Real runs happen locally.
    const simulated = process.env.VERCEL === "1" && isDemo;
    const firstRun = await runTest(testCode, workDir, simulated ? DEMO_FIRST_RUN : undefined);
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
        rerun = await runTest(testCode, workDir, simulated ? DEMO_RERUN : undefined);
      }
    }

    // ── 0G Chain: commit the verification result ──────────────────────────────
    let ogProof = null;
    if (isOGConfigured() && recordingHash) {
      try {
        const { id, txHash: reportTxHash } = await reportToChain(
          recordingHash,
          analysis.summary
        );
        const patchHash = patchResult?.length
          ? (await import("ethers")).ethers.keccak256(
              Buffer.from(patchResult.map((p) => p.after).join("\n"))
            )
          : "";
        const passed = rerun?.passed ?? false;
        const { txHash: verifyTxHash } = await verifyOnChain(id, passed, patchHash);
        ogProof = {
          recordingHash,
          reportId: id,
          reportTxHash,
          verifyTxHash,
          explorerUrl: OG_EXPLORER + "/tx/" + verifyTxHash,
        };
      } catch {}
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
      ogProof,
    };

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
