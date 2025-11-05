const hre = require("hardhat");

async function main() {
    const contractAddress = "0x9BfA34cE0466Bc4c725d16E2e5aCf88f372c525D";

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("全NFTのtokenURIとメタデータ確認");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const VillainAmbassadorNFT = await hre.ethers.getContractFactory("VillainAmbassadorNFT");
    const contract = VillainAmbassadorNFT.attach(contractAddress);

    const rarityNames = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Galaxy", "Origin"];

    for (let tokenId = 1; tokenId <= 3; tokenId++) {
        console.log(`Token ID ${tokenId}:`);
        console.log("─────────────────────────────────────");

        const tokenURI = await contract.tokenURI(tokenId);
        const rarity = await contract.tokenRarity(tokenId);
        const code = await contract.tokenCode(tokenId);
        const owner = await contract.ownerOf(tokenId);

        console.log("tokenURI:", tokenURI);
        console.log("Owner:", owner);
        console.log("Rarity:", rarityNames[Number(rarity)], `(${rarity})`);
        console.log("Code:", code);
        console.log("");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("まとめ");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("現在のbaseURI: https://villain-nft-api.vercel.app/api/metadata/");
    console.log("状態: まだVercelにデプロイされていません");
    console.log("");
    console.log("次のステップ:");
    console.log("1. villain-nft-apiをVercelにデプロイ");
    console.log("2. または、コントラクトのbaseURIを更新");
    console.log("   (例: setBaseURI('https://your-actual-domain.com/api/metadata/')");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
