# ReplayPatch - Midnight Wave 2 Demo Script (2-3 min)

0:00-0:20 (HOOK) "QA is broken. Vague bug reports, slow repro, no proof. ReplayPatch anchors content-hiding QA attestations on Midnight - only hashes and verdict go on-chain; recordings and patches never do."

0:20-1:00 (BUG) Show uploading a bug recording (demo-bug.mp4) at replaypatch.vercel.app. Explain frames extracted, repro steps inferred.

1:00-1:40 (TEST) Generated Playwright test runs and FAILS - proves the bug is reproducible. Every bug becomes an executable test.

1:40-2:20 (FIX) AI patches source; reruns test → PASSES. Proof of fix tied to the same attestation.

2:20-2:50 (PRIVACY/ATTEST) "Instead of posting full artifacts, we write a hiding commitment to a Midnight Compact contract (attest/verify circuits). Reporter is pseudonymous. domainTag is sealed. Only 'exists and passed' is disclosed." Point to contracts/compact/qa-attestation.compact and compiled artifacts.

2:50-3:00 (CLOSE) "ReplayPatch: auditable AI QA with privacy-first attestations on Midnight. GitHub: bernieboy0001/replaypatch"
