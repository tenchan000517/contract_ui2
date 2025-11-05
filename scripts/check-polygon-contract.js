const hre = require("hardhat");

async function main() {
    // Polygonデプロイ済みコントラクト
    const contractAddress = "0x168CCB189b180d6caBEf70fB8604227e300a092F";

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Polygon Contract Check");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const contract = await hre.ethers.getContractAt(
        "VillainAmbassadorNFT",
        contractAddress
    );

    // baseExtensionを確認
    const baseExtension = await contract.baseExtension();
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`baseExtension: "${baseExtension}"`);
    console.log(`baseExtension length: ${baseExtension.length}\n`);

    // 期待値チェック
    if (baseExtension === "") {
        console.log("✅ baseExtension is correctly set to empty string!");
    } else {
        console.log(`❌ WARNING: baseExtension is "${baseExtension}" (expected: "")`);
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
