# ReplayPatch

> Upload a screen recording of a bug. ReplayPatch turns it into a failing
> Playwright test, fixes the code with GPT-5.5, reruns the test, and proves the fix —
> all committed permanently to **0G Chain** and stored on **0G Storage**.

## How it works

```
video upload
   │
   ▼
ffmpeg (bundled) extracts key frames
   │  └──► bug recording uploaded to 0G Storage (permanent)
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
verification result committed to 0G Chain (immutable proof)
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

## 0G integration (Mainnet)

ReplayPatch writes two proofs to **0G Mainnet** on every verification cycle:

1. **0G Storage** — the original bug recording is uploaded permanently
2. **0G Chain** — the `QAVerifier` contract records the recording hash, test result,
   patch hash, and timestamp

**QAVerifier is live:** `0x43D39f423baf019675D407C0444471da00cbDB11` —
[chainscan.0g.ai](https://chainscan.0g.ai/address/0x43D39f423baf019675D407C0444471da00cbDB11)

| Network | Chain ID | RPC | Explorer |
| ------- | -------- | --- | -------- |
| Mainnet | 16661 | https://evmrpc.0g.ai | https://chainscan.0g.ai |
| Galileo Testnet | 16602 | https://evmrpc-testnet.0g.ai | https://chainscan-galileo.0g.ai |

### Deploy the contract

```bash
# 1. compile the contract
npm run compile          # → artifacts/QAVerifier.json

# 2. deploy (defaults: mainnet; override with .env)
npm run deploy
# → prints the contract address + explorer link
#   (run scripts/proof.ts to write a report + verify record on chain)

# 3. add wiring to .env
echo "OG_CONTRACT_ADDRESS=<address from step 2>" >> .env
echo "OG_PRIVATE_KEY=<your wallet key>"          >> .env
```

Mainnet 0G must be bought or bridged via https://get.0g.ai — there is no mainnet
faucet. For free test runs, set the testnet overrides in `.env`:

```
OG_RPC_URL=https://evmrpc-testnet.0g.ai
OG_CHAIN_ID=16602
```

After deployment, every pipeline run commits to 0G automatically. The UI shows
the report tx and verify tx with links to the 0G Explorer.

## Demo mode (no API key)

If `OPENAI_API_KEY` is unset, ReplayPatch runs in **demo mode** against the
bundled sample bug in `sample-app/`. No OpenAI calls, no 0G writes. The full
loop (video → failing test → patch → green) still works.

## Config

| Env var               | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `OPENAI_API_KEY`      | Required for live analysis. Else demo mode.          |
| `OPENAI_MODEL`        | Model id (default `gpt-5.5`).                        |
| `TARGET_URL`          | Where the generated test runs (`file://` or http).   |
| `TARGET_REPO`         | Folder the patcher may read/write.                   |
| `GITHUB_TOKEN`        | Optional — opens a PR with the fix.                  |
| `OG_RPC_URL`          | 0G Chain RPC (default mainnet `https://evmrpc.0g.ai`). |
| `OG_CHAIN_ID`         | 0G Chain ID (default `16661` mainnet).                  |
| `OG_PRIVATE_KEY`      | Wallet key for writing to 0G Chain.                  |
| `OG_CONTRACT_ADDRESS` | QAVerifier address (live: `0x43D39f…DB11`).             |
| `OG_EXPLORER`         | 0G chain explorer (default `chainscan.0g.ai`).          |
| `OG_STORAGE_EXPLORER` | 0G storage explorer (default storagescan).              |

## Stack

- **Next.js 15** (App Router) + **React 19**
- **OpenAI SDK** (GPT-5.5 vision + code repair)
- **Playwright** (test generation + execution)
- **ffmpeg-static** (bundled binary, no system install)
- **ethers.js v6** (0G Chain interaction)
- **0G Chain** (immutable verification proofs)
- **0G Storage** (permanent bug recording archive)

## 🏆 0G Bridge by AKINDO — Wave 3 Submission

Built for the [0G Bridge Buildathon](https://app.akindo.io/wave-hacks/Z4MlX4vreI72ol6pd).
Every bug fix is now a verifiable, on-chain record.

- `#0GBridge` `#BuildOn0G`
- @0G_labs @0G_Builders @AKINDO_io
