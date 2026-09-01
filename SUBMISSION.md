# ReplayPatch — 0G Bridge Wave 3 Submission Kit

Everything you need to submit today. The QAVerifier contract is **live on 0G Mainnet**
(Chain ID 16661) with verified on-chain proof.

---

## 1. X Post (mandatory — copy & paste)

> ReplayPatch turns bug videos into pull requests — and writes every step to 0G.
>
> 🎬 Upload a screen recording → GPT-5.5 watches the frames → writes a Playwright test → patches the code → reruns and verifies the fix.
>
> ⛓ Every recording, test result, and patch is committed to **0G Mainnet** via a QAVerifier contract — on-chain, verifiable QA. Bug reports stop being trusting screenshots and start being auditable AI work.
>
> Demo + repo: replaypatch.vercel.app
>
> #0GBridge #BuildOn0G @0G_labs @0G_Builders @AKINDO_io
>
> *(attach: demo screenshot or short clip)*

---

## 2. Demo video script (max 3 min)

**0:00–0:20 — Hook**
"QA is broken. Users send vague bug reports, devs waste hours reproducing them, and nobody trusts the track record. This is ReplayPatch."

**0:20–1:00 — The bug + observed**
Record yourself clicking a button that should open a modal — it doesn't. Upload the clip. ReplayPatch extracts frames and shows the repro steps it reconstructed.

**1:00–1:40 — The test**
Show the generated Playwright test. It runs and FAILS — the bug is reproduced. "Every bug becomes an executable test, not a screenshot."

**1:40–2:20 — The fix**
GPT-5.5 reads the failing output + source, writes the patch. Rerun → PASS. "The fix is proven in the same test that caught the bug."

**2:20–2:50 — 0G on-chain proof**
Show a QAVerifier tx on chainscan.0g.ai — recording hash, verification result, patch hash, timestamp. "Every fix is now an immutable, verifiable record on 0G." (Live example below.)

**2:50–3:00 — Close**
"ReplayPatch. AI QA you can audit. Built on 0G." (+ logo)

---

## 3. Submission fields

**Project name**
ReplayPatch

**One-line description (≤30 words)**
AI that turns bug screen-recordings into verified pull requests — permanently recorded on 0G Chain and Storage.

**Summary (what it does, problem, 0G components)**
ReplayPatch uploads a bug recording, extracts frames, has GPT-5.5 reconstruct repro steps and write a Playwright test, then patches the source and reruns to prove the fix. It uses **0G Chain** (QAVerifier contract records recording hash, test result, patch hash) and **0G Storage** (permanent recording archive) on 0G Mainnet.

**0G components used**
- 0G Chain (mainnet `16661`) — QAVerifier contract `0x43D39f423baf019675D407C0444471da00cbDB11` on [chainscan.0g.ai](https://chainscan.0g.ai/address/0x43D39f423baf019675D407C0444471da00cbDB11)
- 0G Storage — bug recordings archived permanently

**On-chain activity proof (QAVerifier `0x43D39f...DB11`)**
- report(): https://chainscan.0g.ai/tx/0xffd6392c9e35c3d25bf388d7c650c60ef8782c774719a185bb03a12d2506167b
- verify(): https://chainscan.0g.ai/tx/0x1cbccba9cad91826e9947662b7f59332d40ef28f013462b9609518a92bd6ed60
- Contract records on chain: 2 (report + verification with patch hash)

**Code repository**
`<your github repo>` (public, README + meaningful commits)

**Demo video**
`<youtube loom link>` — see script above

**Public X post**
`<your x post link>`

**Repository live demo**
replaypatch.vercel.app

---

## 4. Commit checklist (Wave 3)
- [x] Deploy QAVerifier to 0G Mainnet (16661) → contract `0x43D39f423baf019675D407C0444471da00cbDB11`
- [x] Produce on-chain proof → report + verify txs recorded (links above)
- [ ] Record 3-min video (script above)
- [ ] Push code to GitHub (public) with README
- [ ] Post on X + reply with link
- [ ] Submit on AKINDO: name, description, repo, demo, X post, 0G integration proof
