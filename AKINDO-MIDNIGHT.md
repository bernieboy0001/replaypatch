# AKINDO Submission â€” ReplayPatch (Midnight Buildathon Wave 2)

Ready-to-paste copy for the AKINDO form. âœ… = fillable now, â›” = needs you (YouTube/X).

---

## Tagline
AI QA you can audit â€” bug screen-recordings in, verified on-chain fixes out on Midnight.

## Product description (â‰¤100 words)
ReplayPatch turns a bug screen-recording into a verified pull request: it extracts key frames, reconstructs repro steps, writes a Playwright test that reproduces the bug, patches the source, then reruns the same test to prove the fix. Every step lands on Midnight â€” the recording is archived permanently on Midnight Storage, and the recording hash, test result, patch hash and timestamp are committed to the QAVerifier contract on Midnight Mainnet (16661). QA stops being trust-me screenshots and becomes auditable, on-chain AI work.

## Product type
**Functional** (repo public, live demo deployed, real on-chain usage)

## Image gallery (5/5)
Upload from `submission-gallery\` (already rendered in repo):
1. `1_landing-before.png` â€” the app, before the click (bug evident)
2. `2_modal-open.png` â€” the details panel open (after the fix)
3. `3_cursor-hover.png` â€” real cursor hover on the button
4. `4_start.png` â€” opening view (fake browser chrome)
5. `5_landing-site.png` â€” the public landing page (`vercel-landing.png`)

## About (Markdown)
### What it does
Upload a screen recording of a bug. ReplayPatch (Next.js + Playwright + GPT-5.5) extracts frames, reconstructs the repro steps, writes a Playwright test that **reproduces** the bug (runs red), patches the source, and reruns the same test to green. Then it writes the whole audit trail to Midnight: the recording to Midnight Storage, and the verification record to the QAVerifier contract on Midnight Chain.

### The problem it solves
QA reports are unstructured and unverifiable: a screenshot, a "works on my machine", a resolution nobody can audit later. ReplayPatch makes every bug an executable test and every fix an immutable on-chain record â€” recording hash, test result and patch hash linked on Midnight Mainnet. Judging becomes "open the block explorer", not "trust me".

### Challenges I ran into
Making the pipeline survive serverless: Playwright needs a real repo, a writable sandbox, and ffmpeg â€” trivially on a laptop, painful on a read-only function filesystem. Solved by copying the target repo into a per-request temp sandbox, bundling ffmpeg-static, and scripting demo-run outputs on Vercel (real runs execute locally). Also hardened Midnight receipt polling so mainnet writes are resilient.

### Technologies I used
Next.js 15 (App Router) Â· TypeScript Â· OpenAI GPT-5.5 (vision + code repair) Â· Playwright (write + run the verification test) Â· ffmpeg-static (frame extraction, no system install) Â· ethers.js v6 Â· Solidity Â· **Midnight Chain** (QAVerifier, mainnet 16661) Â· **Midnight Storage** (permanent recording archive).

### How we built it
Video in â†’ ffmpeg extracts key frames (and Midnight Storage archives the raw clip) â†’ GPT-5.5 watches frames and writes repro steps + expected behavior â†’ GPT-5.5 writes a Playwright test â†’ test runs red (bug proved) â†’ GPT-5.5 reads the failing output + source and generates the patch â†’ rerun goes green â†’ `report()` + `verify()` commit the result to QAVerifier on Midnight Chain. The UI links every proof straight to the Midnight Explorer.

### What we learned
A model can write good code â€” but "prove it" needs an executable harness. Playwright + a writable repo sandbox turns a video into evidence, and Midnight turns that evidence into a public good: permanent, censor-proof QA history.

### What's next for ReplayPatch
Real PRs (GitHub wiring scaffolded via `GITHUB_TOKEN`), pasting any repo instead of a bundled sample, multi-step regression suites, and a dashboard that turns the Midnight audit log into per-repo QA analytics.

## Deliverable URL âœ…
https://github.com/bernieboy0001/replaypatch

## Video â›” (needs you)
Upload either clip to YouTube (public) and paste the URL here:
- `demo-bug.mp4` â€” recording of the bug (click does nothing)
- `demo-fixed.mp4` â€” after the fix (details panel opens)
Script to follow is in `SUBMISSION.md` Â§2 (3-min script).

## Live demo âœ…
https://replaypatch.vercel.app

## Build with (infrastructure layer) âœ…
Midnight Chain, Midnight Storage, Solidity / EVM

## Product Category (max 3) âœ…
Developer Tools, AI, QA Infrastructure

## Tags (max 10) âœ…
Next.js, TypeScript, Playwright, Solidity, OpenAI GPT-5.5, ffmpeg, ethers.js, Midnight Chain, Midnight Storage, AI

## Product detail visibility âœ…
Show

## Midnight integration proof âœ…
- QAVerifier (mainnet 16661): `0x43D39f423baf019675D407C0444471da00cbDB11`
  https://chainscan.0g.ai/address/0x43D39f423baf019675D407C0444471da00cbDB11
- Latest report(): https://chainscan.0g.ai/tx/0xf665949769444cb669a40a89b6635fd006d087db9263b0bd03352732eca924130
- Latest verify(): https://chainscan.0g.ai/tx/0x7e0b67bcef727a7b2875dbf03d66c2affc84948e1292d1eb12796fde81aeaebe

## Connect â›” (your accounts only)
- X: https://x.com/your_account â†’ *(credit: post the mandatory X post first, link it here)*
- Discord: â€”
- Telegram: â€”
- Email: your email
