const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const contractAddress = "0x315c0eA0CBE0CdCeae2a3ae4E30eBE7db752D046";
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("baseExtension修正");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("アカウント:", deployer.address);
    console.log("");
    
    const VillainAmbassadorNFT = await hre.ethers.getContractFactory("VillainAmbassadorNFT");
    const contract = VillainAmbassadorNFT.attach(contractAddress);

    // 現在のbaseExtensionを確認
    const currentExtension = await contract.baseExtension();
    console.log("現在のbaseExtension:", currentExtension);
    
    // 空文字列に変更
    console.log("\nbaseExtensionを空文字列に変更中...");
    const tx = await contract.setBaseExtension("");
    console.log("トランザクション送信:", tx.hash);
    
    await tx.wait();
    console.log("✅ 変更完了");
    
    // 確認
    const newExtension = await contract.baseExtension();
    console.log("\n新しいbaseExtension:", `"${newExtension}"`);
    
    // tokenURIを確認
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("修正後のtokenURI");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    for (let tokenId = 1; tokenId <= 3; tokenId++) {
        const uri = await contract.tokenURI(tokenId);
        console.log(`Token #${tokenId}: ${uri}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
