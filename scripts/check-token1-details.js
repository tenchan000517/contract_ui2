const hre = require("hardhat");

async function main() {
    const contractAddress = "0x315c0eA0CBE0CdCeae2a3ae4E30eBE7db752D046";
    
    const VillainAmbassadorNFT = await hre.ethers.getContractFactory("VillainAmbassadorNFT");
    const contract = VillainAmbassadorNFT.attach(contractAddress);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Token #1の詳細情報");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const tokenId = 1;
    
    // tokenURI取得
    const uri = await contract.tokenURI(tokenId);
    console.log("tokenURI:", uri);
    console.log("");
    
    // レアリティ取得
    const rarity = await contract.tokenRarity(tokenId);
    console.log("レアリティ番号:", rarity.toString());
    
    // レアリティ名取得
    const rarityName = await contract.getRarityName(rarity);
    console.log("レアリティ名:", rarityName);
    console.log("");
    
    // villainpassコード取得
    const code = await contract.tokenCode(tokenId);
    console.log("villainpassコード:", code);
    console.log("");
    
    // オーナー取得
    const owner = await contract.ownerOf(tokenId);
    console.log("オーナー:", owner);
    console.log("");
    
    // 画像番号の計算
    const imageNumber = Number(rarity) + 1;
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("画像情報");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`画像番号: ${imageNumber}.jpg`);
    console.log(`画像URL: https://0xmavillain.com/data/ambassador/img/${imageNumber}.jpg`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
