# ReplayPatch â€” Midnight Buildathon Wave 2 Submission Kit

Everything you need to submit today. The QA Attestation (Compact) contract is newly implemented for this submission and compiles under compiler 0.31.1 (language 0.23.0)
(Midnight network: dual-ledger, content-hiding attestations via Compact) with verified on-chain proof.

---

## 1. X Post (mandatory â€” copy & paste)

> ReplayPatch turns bug videos into pull requests â€” and writes every step to 0G.
>
> ðŸŽ¬ Upload a screen recording â†’ GPT-5.5 watches the frames â†’ writes a Playwright test â†’ patches the code â†’ reruns and verifies the fix.
>
> â›“ Every recording, test result, and patch is committed to **Midnight network** via a QA Attestation (Compact) contract â€” on-chain, verifiable QA. Bug reports stop being untrusted screenshots and become auditable AI work: attestations expose only hashes and the verdict, not recordings or patches.
>
> Demo + repo: replaypatch.vercel.app
>
> #MidnightBuildathon #PrivacyFirst #ZK #ReplayPatch @0G_labs @0G_Builders @AKINDO_io
>
> *(attach: demo screenshot or short clip)*

---

## 2. Demo video script (max 3 min)

**0:00â€“0:20 â€” Hook**
"QA is broken. Users send vague bug reports, devs waste hours reproducing them, and nobody trusts the track record. This is ReplayPatch."

**0:20â€“1:00 â€” The bug + observed**
Record yourself clicking a button that should open a modal â€” it doesn't. Upload the clip. ReplayPatch extracts frames and shows the repro steps it reconstructed.

**1:00â€“1:40 â€” The test**
Show the generated Playwright test. It runs and FAILS â€” the bug is reproduced. "Every bug becomes an executable test, not a screenshot."

**1:40â€“2:20 â€” The fix**
GPT-5.5 reads the failing output + source, writes the patch. Rerun â†’ PASS. "The fix is proven in the same test that caught the bug."

**2:20â€“2:50 â€” 0G on-chain proof**
Show a QA Attestation (Compact) tx on Midnight explorer â€” recording hash, verification result, patch hash, timestamp. "Every fix is now an immutable, verifiable, content-hiding record anchored on Midnight." (Live example below.)

**2:50â€“3:00 â€” Close**
"ReplayPatch. AI QA you can audit. Built on 0G." (+ logo)

---

## 3. Submission fields

**Project name**
ReplayPatch

**One-line description (â‰¤30 words)**
AI that turns bug screen-recordings into verified pull requests â€” permanently recorded using Midnight (content-hiding attestations via Compact + private state).

**Summary (what it does, problem, 0G components)**
ReplayPatch uploads a bug recording, extracts frames, has GPT-5.5 reconstruct repro steps and write a Playwright test, then patches the source and reruns to prove the fix. It uses **0G Chain** (QA Attestation (Compact) contract records recording hash, test result, patch hash) and **0G Storage** (permanent recording archive) on Midnight network.

**Midnight components used**
- Midnight network (attestation anchor on dual-ledger `16661`) â€” QA Attestation (Compact) contract `0x43D39f423baf019675D407C0444471da00cbDB11` on [Midnight explorer](https://Midnight explorer/address/0x43D39f423baf019675D407C0444471da00cbDB11)
- 0G Storage â€” bug recordings archived permanently

**On-chain activity proof (QA Attestation (Compact) `0x43D39f...DB11`)**
- report(): https://Midnight explorer/tx/0xf665949769444cb669a40a89b6635fd006d087db9263b0bd03352732eca924130
- verify(): https://Midnight explorer/tx/0x7e0b67bcef727a7b2875dbf03d66c2affc84948e1292d1eb12796fde81aeaebe
- Contract records on chain: 4+ (report + verification with patch hash, latest run via the deployed API)

**Code repository**
`<your github repo>` (public, README + meaningful commits)

**Demo video**
`<youtube loom link>` â€” see script above

**Public X post**
`<your x post link>`

**Repository live demo**
replaypatch.vercel.app

---

## 4. Commit checklist (Wave 3)
- [x] Deploy QA Attestation (Compact) to Midnight network (16661) â†’ contract `0x43D39f423baf019675D407C0444471da00cbDB11`
- [x] Produce on-chain proof â†’ report + verify txs recorded (links above)
- [ ] Record 3-min video (script above)
- [ ] Push code to GitHub (public) with README
- [ ] Post on X + reply with link
- [ ] Submit on AKINDO: name, description, repo, demo, X post, 0G integration proof








