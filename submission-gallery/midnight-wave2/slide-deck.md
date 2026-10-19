# ReplayPatch — Midnight Buildathon Wave 2

## Problem: Bug reports aren't verifiable
- Users send recordings/screenshots; devs waste time reproducing.
- Trust gap: "fixed" claims lack proof; metadata often public.

## Solution: Content-hiding QA attestations
- Upload bug recording → frames → GPT generates Playwright test (fails) → patches → test passes.
- Midnight Compact contract (contracts/compact/qa-attestation.compact) records only hashes + verdict.
- Reporter is pseudonymous (H(localReporterKey)), domainTag sealed at construction; recordings/patches never go on-chain.

## Midnight integration
- Compact 0.31.1 / lang 0.23.0; ttest/erify circuits; sealed ledger domainTag, hiding commitments.
- Artifacts copied to contracts/out/ and lib/compact/.
- Privacy: selective disclosure (only "attestation exists, run passed").

## Demo
- Live app: replaypatch.vercel.app
- GitHub: https://github.com/bernieboy0001/replaypatch

## Technical notes
- compiles ✔ (EXIT 0); generated keys/circuits included.
- Fulfills "at least one Compact contract that compiles successfully" (Midnight gate).

## Progress this Wave
- Added Midnight Compact contract (content-hiding QA attestations).
- Integrated compiled artifacts for future wallet binding.
- Reframed submission for Midnight privacy narrative.
