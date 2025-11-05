const hre = require("hardhat");

async function main() {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("V1コントラクト調査");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const v1Address = "0xfba3BB65D179F9Dcd51a3b2B71D43ABBd0f6F0C6";
    
    const VillainAmbassadorNFT = await hre.ethers.getContractFactory("VillainAmbassadorNFT");
    const v1Contract = VillainAmbassadorNFT.attach(v1Address);
    
    console.log("V1アドレス:", v1Address);
    console.log("");
    
    try {
        // baseExtensionを確認
        const baseExtension = await v1Contract.baseExtension();
        console.log("baseExtension:", `"${baseExtension}"`);
        console.log("");
        
        // tokenURI(1)を確認
        const tokenURI1 = await v1Contract.tokenURI(1);
        console.log("tokenURI(1):", tokenURI1);
        console.log("");
        
        // totalSupplyを確認
        const totalSupply = await v1Contract.totalSupply();
        console.log("totalSupply:", totalSupply.toString());
        console.log("");
        
        // Token #1の情報
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("V1 Token #1の情報");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        const rarity = await v1Contract.tokenRarity(1);
        const rarityName = await v1Contract.getRarityName(rarity);
        const code = await v1Contract.tokenCode(1);
        
        console.log("レアリティ:", rarityName, `(${rarity})`);
        console.log("コード:", code);
        
        // 画像番号の計算
        const imageNumber = Number(rarity) + 1;
        console.log("画像番号:", `${imageNumber}.jpg`);
        
    } catch (error) {
        console.error("エラー:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
