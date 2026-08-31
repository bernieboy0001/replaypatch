import { ethers } from "ethers";

// 0G Chain — EVM-compatible, same tooling as Ethereum
const RPC   = process.env.OG_RPC_URL   || "https://evm.0g.ai";
const CHAIN = parseInt(process.env.OG_CHAIN_ID || "12345");

const ABI = [
  "function report(bytes32 recordingHash, string summary) returns (bytes32)",
  "function verify(bytes32 id, bool passed, bytes32 patchHash) returns ()",
  "function count() view returns (uint256)",
  "event BugReported(bytes32 indexed id, address indexed agent, bytes32 recordingHash, uint256 timestamp)",
];

async function main() {
  const pk = process.env.OG_PRIVATE_KEY;
  if (!pk) { console.error("Set OG_PRIVATE_KEY"); process.exit(1); }

  const provider = new ethers.JsonRpcProvider(RPC, CHAIN);
  const wallet   = new ethers.Wallet(pk, provider);
  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "OG");

  // Deploy QAVerifier
  const artifact = JSON.parse(
    require("fs").readFileSync("artifacts/QAVerifier.json", "utf8")
  );
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const addr = await contract.getAddress();

  console.log("\n✓ QAVerifier deployed to:", addr);
  console.log("  Explorer:", process.env.OG_EXPLORER || "https://explorer.0g.ai", "/address/" + addr);
  console.log("\nAdd to .env / Render:");
  console.log("  OG_CONTRACT_ADDRESS=" + addr);
}

main().catch((e) => { console.error(e); process.exit(1); });
