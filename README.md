# ReplayPatch

> Upload a screen recording of a bug. ReplayPatch turns it into a failing
> Playwright test, fixes the code with GPT-5.5, reruns the test, and proves the fix.

The recording becomes a permanent regression test. QA videos stop being throwaway
evidence and start being executable specifications.

## How it works

```
video upload
   │
   ▼
ffmpeg (bundled) extracts key frames
   │
   ▼
GPT-5.5 watches the frames → repro steps + expected behavior
   │
   ▼
GPT-5.5 writes a Playwright test from the steps
   │
   ▼
Playwright runs it → bug reproduced (fails, as expected)
   │
   ▼
GPT-5.5 reads the failing output + source → patches the code
   │
   ▼
Playwright reruns → fix verified (passes)
   │
   ▼
(optional) GitHub PR opened with the patch
```

## Quick start

```bash
cd replaypatch
npm install
cp .env.example .env        # add OPENAI_API_KEY + OPENAI_MODEL=gpt-5.5
npx playwright install chromium
npm run dev
```

Open http://localhost:3000, upload a bug video, watch the pipeline.

## Demo mode (no API key)

If `OPENAI_API_KEY` is unset, ReplayPatch runs in **demo mode** against the
bundled sample bug in `sample-app/`:

- `sample-app/index.html` — a button that should open a modal
- `sample-app/app.js` — has a `visiblity` typo so the modal never shows

The pipeline reproduces the bug, patches `app.js`, and reruns to green — no
OpenAI calls required. This is what the deployed hackathon demo shows.

## Config

| Env var          | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `OPENAI_API_KEY` | Required for live analysis. Else demo mode.          |
| `OPENAI_MODEL`   | Model id (default `gpt-5.5`).                        |
| `TARGET_URL`     | Where the generated test runs (`file://` or http).   |
| `TARGET_REPO`    | Folder the patcher may read/write.                   |
| `GITHUB_TOKEN`   | Optional — opens a PR with the fix.                  |

## Stack

- Next.js 15 (App Router) + React 19
- OpenAI SDK (vision + code repair)
- Playwright (test generation + execution)
- ffmpeg-static (no system ffmpeg needed)
