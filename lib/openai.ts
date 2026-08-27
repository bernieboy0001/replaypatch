import OpenAI from "openai";
import { ReproStep } from "./types";
import { frameToDataUrl } from "./frames";

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5.5";
const HAS_KEY = !!apiKey;

function client(): OpenAI {
  return new OpenAI({ apiKey: apiKey! });
}

function jsonFrom(text: string): any {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return {};
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return {};
  }
}

export interface VideoAnalysis {
  summary: string;
  reproSteps: ReproStep[];
  expectedBehavior: string;
}

// --- DEMO MODE (no API key) ----------------------------------------------
// Mirrors the bundled sample-app bug: a button that should open a modal.
function demoAnalysis(): VideoAnalysis {
  return {
    summary:
      "User clicks the 'Open details' button. Nothing happens — the modal that should appear stays hidden. The button has no working click handler.",
    reproSteps: [
      { action: "navigate", description: "Open the page", selector: "file://./sample-app/index.html" },
      { action: "click", description: "Click the 'Open details' button", selector: "#openBtn" },
      { action: "assert", description: "The details modal should become visible", selector: "#modal" },
    ],
    expectedBehavior:
      "After clicking '#openBtn', the element '#modal' should have its display style set to 'block' (visible).",
  };
}

export async function analyzeVideo(framePaths: string[]): Promise<VideoAnalysis> {
  if (!HAS_KEY) return demoAnalysis();

  const content: any[] = [
    {
      type: "text",
      text:
        "You are a QA engineer. Analyze these screen-recording frames of a software bug. " +
        "Return strict JSON: {summary: string, reproSteps: [{action, description, selector?, value?}], expectedBehavior: string}. " +
        "action must be one of: click, type, navigate, hover, wait, assert, other.",
    },
  ];
  for (const f of framePaths) {
    content.push({ type: "image_url", image_url: { url: frameToDataUrl(f) } });
  }

  const res = await client().chat.completions.create({
    model,
    messages: [{ role: "user", content }],
    response_format: { type: "json_object" },
  });
  const parsed = jsonFrom(res.choices[0].message.content || "{}");
  return {
    summary: parsed.summary || "No summary.",
    reproSteps: Array.isArray(parsed.reproSteps) ? parsed.reproSteps : [],
    expectedBehavior: parsed.expectedBehavior || "",
  };
}

export async function generateTest(
  analysis: VideoAnalysis,
  targetUrl: string
): Promise<string> {
  if (!HAS_KEY) return demoTest(targetUrl);

  const res = await client().chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content:
          "Write a Node.js Playwright script (ESM, `import { chromium } from 'playwright'`) that reproduces this bug.\n" +
          "It must: launch chromium headless, goto the target URL, perform the repro steps, then assert the expected behavior.\n" +
          "On success print 'REPLAYPATCH_PASS' and exit 0. On failure print 'REPLAYPATCH_FAIL' with the reason and exit 1.\n" +
          "Return ONLY the raw JavaScript code, no markdown.\n\n" +
          "TARGET URL: " +
          targetUrl +
          "\n\nANALYSIS:\n" +
          JSON.stringify(analysis, null, 2),
      },
    ],
  });
  return stripCodeFence(res.choices[0].message.content || "");
}

export async function generatePatch(opts: {
  failureOutput: string;
  targetUrl: string;
  repoFiles: { path: string; content: string }[];
}): Promise<{ path: string; content: string }[]> {
  if (!HAS_KEY) return demoPatch();

  const res = await client().chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content:
          "A Playwright test failed with this output:\n" +
          opts.failureOutput +
          "\n\nFix the bug by editing the source files below. " +
          "Return strict JSON: {files: [{path: string, content: string}]} where content is the FULL new file content.\n" +
          "Only include files you changed.\n\nSOURCE FILES:\n" +
          opts.repoFiles.map((f) => `### ${f.path}\n${f.content}`).join("\n\n"),
      },
    ],
    response_format: { type: "json_object" },
  });
  const parsed = jsonFrom(res.choices[0].message.content || "{}");
  return Array.isArray(parsed.files) ? parsed.files : [];
}

// --- demo helpers --------------------------------------------------------
function stripCodeFence(s: string): string {
  if (s.includes("```")) {
    return s.replace(/```(js|javascript|ts)?/g, "").replace(/```/g, "").trim();
  }
  return s.trim();
}

function demoTest(targetUrl: string): string {
  return `import { chromium } from 'playwright';

const TARGET = ${JSON.stringify(targetUrl)};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(TARGET);
  await page.click('#openBtn');
  await page.waitForTimeout(300);
  const visible = await page.isVisible('#modal');
  await browser.close();
  if (visible) {
    console.log('REPLAYPATCH_PASS');
    process.exit(0);
  } else {
    console.log('REPLAYPATCH_FAIL: #modal did not become visible after clicking #openBtn');
    process.exit(1);
  }
})();
`;
}

function demoPatch(): { path: string; content: string }[] {
  return [
    {
      path: "app.js",
      content: `document.getElementById("openBtn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "block";
});
`,
    },
  ];
}

export const isDemo = !HAS_KEY;
