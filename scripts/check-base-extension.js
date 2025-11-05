const hre = require("hardhat");

async function main() {
    // デプロイされたコントラクトアドレス
    const contractAddress = "0xfca5d6b366c097de75a2de0346028b37368daeac";

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Checking baseExtension...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // コントラクトインスタンスを取得
    const contract = await hre.ethers.getContractAt(
        "VillainAmbassadorNFT",
        contractAddress
    );

    // baseExtensionを取得
    const baseExtension = await contract.baseExtension();

    console.log(`Contract Address: ${contractAddress}`);
    console.log(`baseExtension: "${baseExtension}"`);
    console.log(`baseExtension length: ${baseExtension.length}`);

    // 期待値チェック
    if (baseExtension === "") {
        console.log("\n✅ baseExtension is correctly set to empty string!");
    } else {
        console.log(`\n❌ WARNING: baseExtension is "${baseExtension}" (expected: "")`);
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
