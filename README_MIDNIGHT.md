# ReplayPatch — Midnight Buildathon Wave 2 (Privacy-Preserving QA Attestations)

## Privacy Design (Midnight Compact)
- contracts/compact/qa-attestation.compact anchors content-hiding attestations (recordingHash, patchHash, salt) to produce ttestationId (hiding commitment); eporter is a pseudonymous digest of localReporterKey via persistentHash. domainTag is a sealed domain separator set at construction to prevent cross-deployment linkage.
- Only commitments and the boolean verdict passed are disclosed; evidence (recording/patch) is never written to ledger. The erify circuit proves preimage+verdict match without revealing content.
- Compiles with Compact compiler 0.31.1 / language 0.23.0. Generated artifacts in contracts/compact/out/ and copied to contracts/out/ and lib/compact/ for TypeScript integration.

# ReplayPatch

> Upload a screen recording of a bug. ReplayPatch turns it into a failing
> Playwright test, fixes the code with GPT-5.5, reruns the test, and proves the fix â€”
> all committed permanently to **Midnight Chain** and stored on **Midnight Storage**.

## How it works

```
video upload
   â”‚
   â–¼
ffmpeg (bundled) extracts key frames
   â”‚  â””â”€â”€â–º bug recording uploaded to Midnight Storage (permanent)
   â–¼
GPT-5.5 watches the frames â†’ repro steps + expected behavior
   â”‚
   â–¼
GPT-5.5 writes a Playwright test from the steps
   â”‚
   â–¼
Playwright runs it â†’ bug reproduced (fails, as expected)
   â”‚
   â–¼
GPT-5.5 reads the failing output + source â†’ patches the code
   â”‚
   â–¼
Playwright reruns â†’ fix verified (passes)
   â”‚
   â–¼
verification result committed to Midnight Chain (immutable proof)
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

## Midnight integration (Mainnet)

ReplayPatch writes two proofs to **Midnight Mainnet** on every verification cycle:

1. **Midnight Storage** â€” the original bug recording is uploaded permanently
2. **Midnight Chain** â€” the `QAVerifier` contract records the recording hash, test result,
   patch hash, and timestamp

**QAVerifier is live:** `0x43D39f423baf019675D407C0444471da00cbDB11` â€”
[chainscan.0g.ai](https://chainscan.0g.ai/address/0x43D39f423baf019675D407C0444471da00cbDB11)

| Network | Chain ID | RPC | Explorer |
| ------- | -------- | --- | -------- |
| Mainnet | 16661 | https://evmrpc.0g.ai | https://chainscan.0g.ai |
| Galileo Testnet | 16602 | https://evmrpc-testnet.0g.ai | https://chainscan-galileo.0g.ai |

### Deploy the contract

```bash
# 1. compile the contract
npm run compile          # â†’ artifacts/QAVerifier.json

# 2. deploy (defaults: mainnet; override with .env)
npm run deploy
# â†’ prints the contract address + explorer link
#   (run scripts/proof.ts to write a report + verify record on chain)

# 3. add wiring to .env
echo "OG_CONTRACT_ADDRESS=<address from step 2>" >> .env
echo "OG_PRIVATE_KEY=<your wallet key>"          >> .env
```

Mainnet Midnight must be bought or bridged via https://get.0g.ai â€” there is no mainnet
faucet. For free test runs, set the testnet overrides in `.env`:

```
OG_RPC_URL=https://evmrpc-testnet.0g.ai
OG_CHAIN_ID=16602
```

After deployment, every pipeline run commits to Midnight automatically. The UI shows
the report tx and verify tx with links to the Midnight Explorer.

## Demo mode (no API key)

If `OPENAI_API_KEY` is unset, ReplayPatch runs in **demo mode** against the
bundled sample bug in `sample-app/`. No OpenAI calls, no Midnight writes. The full
loop (video â†’ failing test â†’ patch â†’ green) still works.

## Config

| Env var               | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `OPENAI_API_KEY`      | Required for live analysis. Else demo mode.          |
| `OPENAI_MODEL`        | Model id (default `gpt-5.5`).                        |
| `TARGET_URL`          | Where the generated test runs (`file://` or http).   |
| `TARGET_REPO`         | Folder the patcher may read/write.                   |
| `GITHUB_TOKEN`        | Optional â€” opens a PR with the fix.                  |
| `OG_RPC_URL`          | Midnight Chain RPC (default mainnet `https://evmrpc.0g.ai`). |
| `OG_CHAIN_ID`         | Midnight Chain ID (default `16661` mainnet).                  |
| `OG_PRIVATE_KEY`      | Wallet key for writing to Midnight Chain.                  |
| `OG_CONTRACT_ADDRESS` | QAVerifier address (live: `0x43D39fâ€¦DB11`).             |
| `OG_EXPLORER`         | Midnight chain explorer (default `chainscan.0g.ai`).          |
| `OG_STORAGE_EXPLORER` | Midnight storage explorer (default storagescan).              |

## Stack

- **Next.js 15** (App Router) + **React 19**
- **OpenAI SDK** (GPT-5.5 vision + code repair)
- **Playwright** (test generation + execution)
- **ffmpeg-static** (bundled binary, no system install)
- **ethers.js v6** (Midnight Chain interaction)
- **Midnight Chain** (immutable verification proofs)
- **Midnight Storage** (permanent bug recording archive)

## ðŸ† Midnight Bridge by AKINDO â€” Wave 3 Submission

Built for the [Midnight Bridge Buildathon](https://app.akindo.io/wave-hacks/Z4MlX4vreI72ol6pd).
Every bug fix is now a verifiable, on-chain record.

- `#MidnightBridge` `#BuildOnMidnight`
- @Midnight_labs @Midnight_Builders @AKINDO_io





## Midnight Contract (New for Wave 2)
- contracts/compact/qa-attestation.compact compiles successfully (compiler 0.31.1, language 0.23.0).
- Generated artifacts: contracts/compact/out/, contracts/out/, lib/compact/.
- Privacy: content-hiding commitments, pseudonymous reporter, sealed domain tag; evidence never written to ledger.

