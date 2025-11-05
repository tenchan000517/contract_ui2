const hre = require("hardhat");

async function main() {
    // コンパイル済みのコントラクトを読み込む
    const artifact = await hre.artifacts.readArtifact("VillainAmbassadorNFT");

    const bytecode = artifact.bytecode;
    const deployedBytecode = artifact.deployedBytecode;

    // バイトコードサイズ（16進数の2文字 = 1バイト）
    const bytecodeSize = (bytecode.length - 2) / 2; // 0xを除く
    const deployedBytecodeSize = (deployedBytecode.length - 2) / 2;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("コントラクトサイズ分析");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Contract: VillainAmbassadorNFT");
    console.log("Bytecode Size:", bytecodeSize, "bytes");
    console.log("Deployed Bytecode Size:", deployedBytecodeSize, "bytes");
    console.log("Max Contract Size: 24576 bytes (24 KB)");
    console.log("");

    if (deployedBytecodeSize > 24576) {
        console.log("❌ WARNING: Contract size exceeds 24KB limit!");
    } else {
        console.log("✅ Contract is within size limit");
        console.log("   Remaining:", 24576 - deployedBytecodeSize, "bytes");
    }
    console.log("");

    // 推定デプロイガス（実績ベース）
    // デプロイガス = 21000 (基本) + 200 * bytecodeSize
    const estimatedDeployGas = 21000 + (200 * bytecodeSize);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("推定デプロイガス");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Formula: 21000 + (200 * bytecode_size)");
    console.log("Estimated Gas:", estimatedDeployGas);
    console.log("");
}

main().catch(console.error);
