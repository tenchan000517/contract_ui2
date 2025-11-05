const hre = require("hardhat");

/**
 * 運営用Genesis Token #0をミント
 * Rarity: 7 (Origin)
 * Code: "00000"
 */
async function main() {
    const [deployer] = await hre.ethers.getSigners();

    // デプロイされたコントラクトアドレス
    const contractAddress = "0xfca5d6b366c097de75a2de0346028b37368daeac";

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Minting Genesis Token #0...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // コントラクトインスタンスを取得
    const contract = await hre.ethers.getContractAt(
        "VillainAmbassadorNFT",
        contractAddress
    );

    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Deployer Address: ${deployer.address}`);
    console.log(`Minting to: ${deployer.address}\n`);

    // Genesis Token #0をミント
    console.log("Minting Genesis Token #0...");
    console.log("Rarity: 0 (Common)");
    console.log("Code: 00000\n");

    const tx = await contract.mint(
        deployer.address,
        0,  // Common
        "00000"
    );

    console.log(`Transaction Hash: ${tx.hash}`);
    console.log("Waiting for confirmation...\n");

    // トランザクション完了を待機
    const receipt = await tx.wait();

    // NFTMintedイベントからtokenIdを取得
    const mintEvent = receipt.logs.find(log => {
        try {
            const parsed = contract.interface.parseLog(log);
            return parsed && parsed.name === 'NFTMinted';
        } catch {
            return false;
        }
    });

    let tokenId = 'Unknown';
    if (mintEvent) {
        const parsed = contract.interface.parseLog(mintEvent);
        tokenId = parsed?.args[0]?.toString() || 'Unknown';
    }

    console.log("✅ Genesis Token minted successfully!\n");
    console.log(`Token ID: #${tokenId}`);
    console.log(`Owner: ${deployer.address}`);
    console.log(`Rarity: Common (0)`);
    console.log(`Code: 00000`);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
