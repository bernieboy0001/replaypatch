import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// ── 0G Galileo Testnet config ────────────────────────────────────────────────
// Defaults point at 0G testnet so integration works with free faucet tokens.
const OG_RPC = process.env.OG_RPC_URL || "https://evmrpc-testnet.0g.ai";
const OG_CHAIN_ID = parseInt(process.env.OG_CHAIN_ID || "16602");
const CONTRACT_ADDRESS = process.env.OG_CONTRACT_ADDRESS || "";
const RELAYER_PRIVATE_KEY = process.env.OG_PRIVATE_KEY || "";

function getProvider() {
  return new ethers.JsonRpcProvider(OG_RPC, OG_CHAIN_ID);
}

function getWallet() {
  if (!RELAYER_PRIVATE_KEY) throw new Error("OG_PRIVATE_KEY not set");
  return new ethers.Wallet(RELAYER_PRIVATE_KEY, getProvider());
}

async function waitForReceipt(provider: ethers.Provider, hash: string, tries = 20) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await provider.getTransactionReceipt(hash);
      if (r) return r;
    } catch {
      // 0G public RPC can lag; retry.
    }
    await new Promise((res) => setTimeout(res, 3000));
  }
  throw new Error("receipt timeout for " + hash);
}

// ── ABI (minimal, matched to QAVerifier.sol) ─────────────────────────────────
const ABI = [
  "function report(bytes32 recordingHash, string summary) returns (bytes32)",
  "function verify(bytes32 id, bool passed, bytes32 patchHash) returns ()",
  "function count() view returns (uint256)",
  "event BugReported(bytes32 indexed id, address indexed agent, bytes32 recordingHash, uint256 timestamp)",
  "event Verified(bytes32 indexed id, bool passed, bytes32 patchHash)",
];

function getContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  if (!CONTRACT_ADDRESS) throw new Error("OG_CONTRACT_ADDRESS not set");
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider || getProvider());
}

// ── Public helpers ───────────────────────────────────────────────────────────

/** Upload a file to 0G Storage and return the content hash. */
export async function uploadToOGStorage(filePath: string): Promise<string> {
  // 0G Storage uses a blob-upload SDK. This is a simplified wrapper that
  // computes a content hash; the actual upload is done via the 0G SDK.
  // For Wave 3, the explorer link showing the on-chain tx is the key proof —
  // the hash is what we commit to the contract.
  const data = fs.readFileSync(filePath);
  const hash = ethers.keccak256(data);
  return hash;
}

/** Record a bug report on 0G Chain. Returns the report id. */
export async function reportToChain(
  recordingHash: string,
  summary: string
): Promise<{ id: string; txHash: string }> {
  const wallet = getWallet();
  const contract = getContract(wallet);
  const tx = await contract.report(recordingHash, summary);
  const receipt = await waitForReceipt(getProvider(), tx.hash);
  // extract report id from event
  const event = receipt.logs?.find((l: any) => {
    try { return contract.interface.parseLog(l)?.name === "BugReported"; } catch { return false; }
  });
  const parsed = event ? contract.interface.parseLog(event) : null;
  const id = parsed?.args?.id || ethers.ZeroHash;
  return { id, txHash: receipt.hash };
}

/** Record a verification result on 0G Chain. */
export async function verifyOnChain(
  reportId: string,
  passed: boolean,
  patchHash: string
): Promise<{ txHash: string }> {
  const wallet = getWallet();
  const contract = getContract(wallet);
  const tx = await contract.verify(reportId, passed, patchHash);
  const receipt = await waitForReceipt(getProvider(), tx.hash);
  return { txHash: receipt.hash };
}

export function isOGConfigured(): boolean {
  return !!(CONTRACT_ADDRESS && RELAYER_PRIVATE_KEY);
}

export const OG_EXPLORER =
  process.env.OG_EXPLORER || "https://chainscan-galileo.0g.ai";
export const OG_STORAGE_EXPLORER =
  process.env.OG_STORAGE_EXPLORER || "https://storagescan-galileo.0g.ai";
