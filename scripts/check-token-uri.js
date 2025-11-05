const hre = require("hardhat");

async function main() {
    const contractAddress = "0x8A285432dB4eA042f0d2cb998ff0A7304287ED53";

    const VillainAmbassadorNFT = await hre.ethers.getContractFactory("VillainAmbassadorNFT");
    const contract = VillainAmbassadorNFT.attach(contractAddress);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("tokenURI確認");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const tokenId = 0;
    try {
        const uri = await contract.tokenURI(tokenId);
        console.log(`Token #${tokenId}:`);
        console.log(`  URI: ${uri}\n`);

        // 期待値チェック
        const expectedURI = "https://villain-nft-api.vercel.app/api/metadata/0";

        if (uri === expectedURI) {
            console.log("✅ tokenURI is correct!");
            console.log(`   Expected: ${expectedURI}`);
            console.log(`   Actual:   ${uri}`);
        } else {
            console.log("❌ WARNING: tokenURI mismatch!");
            console.log(`   Expected: ${expectedURI}`);
            console.log(`   Actual:   ${uri}`);

            // .json が含まれているかチェック
            if (uri.includes(".json")) {
                console.log("\n⚠️  CRITICAL: tokenURI contains '.json' suffix!");
                console.log("   This will cause 400 Bad Request on the API.");
            }
        }
    } catch (error) {
        console.log(`Token #${tokenId}: エラー - ${error.message}`);
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
