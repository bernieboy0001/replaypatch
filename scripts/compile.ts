import solc from "solc";
import fs from "fs";
import path from "path";

// Path to the Solidity contract (relative to project root)
const CONTRACT_PATH = path.join(process.cwd(), "contracts", "QAVerifier.sol");
const OUT_DIR = path.join(process.cwd(), "artifacts");

function main() {
  const source = fs.readFileSync(CONTRACT_PATH, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "contracts/QAVerifier.sol": { content: source },
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const hard = output.errors.filter((e: any) => e.severity === "error");
    if (hard.length) {
      console.error(hard.map((e: any) => e.formattedMessage).join("\n"));
      process.exit(1);
    }
  }

  const contract = output.contracts["contracts/QAVerifier.sol"]["QAVerifier"];
  if (!contract) {
    console.error("QAVerifier not found in compiled output");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const artifact = {
    contractName: "QAVerifier",
    abi: contract.abi,
    bytecode: "0x" + contract.evm.bytecode.object,
  };
  fs.writeFileSync(
    path.join(OUT_DIR, "QAVerifier.json"),
    JSON.stringify(artifact, null, 2)
  );
  console.log("✓ Compiled QAVerifier → artifacts/QAVerifier.json");
}

main();
