import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// 0G Galileo Testnet — EVM-compatible, same tooling as Ethereum.
// Free testnet tokens from https://faucet.0g.ai
const RPC   = process.env.OG_RPC_URL   || "https://evmrpc-testnet.0g.ai";
const CHAIN = parseInt(process.env.OG_CHAIN_ID || "16602");

async function main() {
  const pk = process.env.OG_PRIVATE_KEY;
  if (!pk) { console.error("Set OG_PRIVATE_KEY"); process.exit(1); }

  const provider = new ethers.JsonRpcProvider(RPC, CHAIN);
  const wallet   = new ethers.Wallet(pk, provider);
  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "OG");
  if ((await provider.getBalance(wallet.address)) === 0n) {
    console.error("\n✗ Wallet has 0 OG — add gas before deploying.");
    process.exit(1);
  }

  // Deploy QAVerifier
  const artifactPath = path.join(process.cwd(), "artifacts", "QAVerifier.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("Deploying QAVerifier…");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const addr = await contract.getAddress();

  console.log("\n✓ QAVerifier deployed to:", addr);
  console.log("  Explorer:", process.env.OG_EXPLORER || "https://chainscan-galileo.0g.ai", "/address/" + addr);
  console.log("\nAdd to .env / Render:");
  console.log("  OG_CONTRACT_ADDRESS=" + addr);
}

main().catch((e) => { console.error(e); process.exit(1); });
