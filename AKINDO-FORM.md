# AKINDO Submission — ReplayPatch (0G Bridge Wave 3)

Ready-to-paste copy for the AKINDO form. ✅ = fillable now, ⛔ = needs you (YouTube/X).

---

## Tagline
AI QA you can audit — bug screen-recordings in, verified on-chain fixes out on 0G.

## Product description (≤100 words)
ReplayPatch turns a bug screen-recording into a verified pull request: it extracts key frames, reconstructs repro steps, writes a Playwright test that reproduces the bug, patches the source, then reruns the same test to prove the fix. Every step lands on 0G — the recording is archived permanently on 0G Storage, and the recording hash, test result, patch hash and timestamp are committed to the QAVerifier contract on 0G Mainnet (16661). QA stops being trust-me screenshots and becomes auditable, on-chain AI work.

## Product type
**Functional** (repo public, live demo deployed, real on-chain usage)

## Image gallery (5/5)
Upload from `submission-gallery\` (already rendered in repo):
1. `1_landing-before.png` — the app, before the click (bug evident)
2. `2_modal-open.png` — the details panel open (after the fix)
3. `3_cursor-hover.png` — real cursor hover on the button
4. `4_start.png` — opening view (fake browser chrome)
5. `5_landing-site.png` — the public landing page (`vercel-landing.png`)

## About (Markdown)
### What it does
Upload a screen recording of a bug. ReplayPatch (Next.js + Playwright + GPT-5.5) extracts frames, reconstructs the repro steps, writes a Playwright test that **reproduces** the bug (runs red), patches the source, and reruns the same test to green. Then it writes the whole audit trail to 0G: the recording to 0G Storage, and the verification record to the QAVerifier contract on 0G Chain.

### The problem it solves
QA reports are unstructured and unverifiable: a screenshot, a "works on my machine", a resolution nobody can audit later. ReplayPatch makes every bug an executable test and every fix an immutable on-chain record — recording hash, test result and patch hash linked on 0G Mainnet. Judging becomes "open the block explorer", not "trust me".

### Challenges I ran into
Making the pipeline survive serverless: Playwright needs a real repo, a writable sandbox, and ffmpeg — trivially on a laptop, painful on a read-only function filesystem. Solved by copying the target repo into a per-request temp sandbox, bundling ffmpeg-static, and scripting demo-run outputs on Vercel (real runs execute locally). Also hardened 0G receipt polling so mainnet writes are resilient.

### Technologies I used
Next.js 15 (App Router) · TypeScript · OpenAI GPT-5.5 (vision + code repair) · Playwright (write + run the verification test) · ffmpeg-static (frame extraction, no system install) · ethers.js v6 · Solidity · **0G Chain** (QAVerifier, mainnet 16661) · **0G Storage** (permanent recording archive).

### How we built it
Video in → ffmpeg extracts key frames (and 0G Storage archives the raw clip) → GPT-5.5 watches frames and writes repro steps + expected behavior → GPT-5.5 writes a Playwright test → test runs red (bug proved) → GPT-5.5 reads the failing output + source and generates the patch → rerun goes green → `report()` + `verify()` commit the result to QAVerifier on 0G Chain. The UI links every proof straight to the 0G Explorer.

### What we learned
A model can write good code — but "prove it" needs an executable harness. Playwright + a writable repo sandbox turns a video into evidence, and 0G turns that evidence into a public good: permanent, censor-proof QA history.

### What's next for ReplayPatch
Real PRs (GitHub wiring scaffolded via `GITHUB_TOKEN`), pasting any repo instead of a bundled sample, multi-step regression suites, and a dashboard that turns the 0G audit log into per-repo QA analytics.

## Deliverable URL ✅
https://github.com/bernieboy0001/replaypatch

## Video ⛔ (needs you)
Upload either clip to YouTube (public) and paste the URL here:
- `demo-bug.mp4` — recording of the bug (click does nothing)
- `demo-fixed.mp4` — after the fix (details panel opens)
Script to follow is in `SUBMISSION.md` §2 (3-min script).

## Live demo ✅
https://replaypatch.vercel.app

## Build with (infrastructure layer) ✅
0G Chain, 0G Storage, Solidity / EVM

## Product Category (max 3) ✅
Developer Tools, AI, QA Infrastructure

## Tags (max 10) ✅
Next.js, TypeScript, Playwright, Solidity, OpenAI GPT-5.5, ffmpeg, ethers.js, 0G Chain, 0G Storage, AI

## Product detail visibility ✅
Show

## 0G integration proof ✅
- QAVerifier (mainnet 16661): `0x43D39f423baf019675D407C0444471da00cbDB11`
  https://chainscan.0g.ai/address/0x43D39f423baf019675D407C0444471da00cbDB11
- Latest report(): https://chainscan.0g.ai/tx/0xf665949769444cb669a40a89b6635fd006d087db9263b0bd03352732eca924130
- Latest verify(): https://chainscan.0g.ai/tx/0x7e0b67bcef727a7b2875dbf03d66c2affc84948e1292d1eb12796fde81aeaebe

## Connect ⛔ (your accounts only)
- X: https://x.com/your_account → *(credit: post the mandatory X post first, link it here)*
- Discord: —
- Telegram: —
- Email: your email