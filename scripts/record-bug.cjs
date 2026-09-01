const { chromium } = require("playwright");
const { spawnSync } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SAMPLE = process.argv[4] || path.join(ROOT, "demo");
const OUT = process.argv[2] || path.join(ROOT, "demo-bug.mp4");
const FIXED = process.argv[3] === "--fixed";
const W = 1280;
const H = 800;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(SAMPLE, p);
  if (!file.startsWith(SAMPLE) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "text/plain", "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(res);
});

async function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

(async () => {
  await new Promise((r) => server.listen(4813, "127.0.0.1", r));
  const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "rp-bug-"));
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: tmp, size: { width: W, height: H } },
  });
  const page = await context.newPage();

  // Fake OS cursor that follows real mouse events → shows up in the recording.
  const CURSOR = `
    (() => {
      const c = document.createElement("div");
      c.id = "rpCursor";
      c.style.cssText =
        "position:fixed;left:0;top:0;width:26px;height:26px;pointer-events:none;z-index:99999;" +
        "filter:drop-shadow(0 2px 3px rgba(0,0,0,.5));transition:transform 60ms linear;";
      c.innerHTML =
        '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 3l6 15 2.4-5.6L18 10z" ' +
        'fill="#fff" stroke="#161009" stroke-width="2" stroke-linejoin="round"/></svg>';
      (document.body || document.documentElement).appendChild(c);
      const upd = (x, y) => { c.style.left = x + "px"; c.style.top = y + "px"; };
      const press = (d) => { c.style.transform = d ? "scale(.82)" : "scale(1)"; };
      window.addEventListener("mousemove", (e) => upd(e.clientX - 2, e.clientY - 2), true);
      window.addEventListener("mousedown", () => press(true), true);
      window.addEventListener("mouseup", () => press(false), true);
      upd(0, 0);
    })();
  `;
  await page.addInitScript(CURSOR);

  const btn = page.locator("#openBtn");
  await page.goto("http://127.0.0.1:4813/", { waitUntil: "networkidle" });
  await wait(1400);

  // human-ish approach: drift from corner, pause over the button, click twice
  await page.mouse.move(W * 0.82, H * 0.78, { steps: 18 });
  await wait(600);
  await page.mouse.move(W * 0.72, H * 0.7, { steps: 16 });
  await wait(700);
  const bb = await btn.boundingBox();
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 14 });
  await wait(650);
  await page.mouse.down();
  await wait(130);
  await page.mouse.up();
  await wait(1500);

  if (FIXED) {
    await page.evaluate(() => {
      const m = document.getElementById("modal");
      m.classList.add("open");
      m.style.display = "flex";
      document.getElementById("status").textContent = "details panel opened ✓";
      document.getElementById("status").className = "ok";
    });
    await wait(2100);
    await page.mouse.move(bb.x + bb.width / 2 + 210, bb.y + bb.height / 2 + 150, { steps: 12 });
    await wait(500);
    await page.mouse.move(bb.x + bb.width / 2 + 400, bb.y - 430, { steps: 14 });
    await wait(600);
  } else {
    await page.mouse.down(); await wait(120); await page.mouse.up();
    await wait(1800);
  }

  await context.close();
  await wait(500);
  await browser.close();
  server.close();

  const webm = fs.readdirSync(tmp).find((f) => f.endsWith(".webm"));
  if (!webm) { console.error("no webm captured"); process.exit(1); }
  const ffmpeg = require("ffmpeg-static");
  const r = spawnSync(ffmpeg, ["-y", "-i", path.join(tmp, webm), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", OUT], { stdio: "inherit" });
  if (r.status !== 0) { console.error("ffmpeg failed"); process.exit(1); }
  console.log("recorded: " + OUT + " (" + fs.statSync(OUT).size + " bytes)");
})();