const hre = require("hardhat");

/**
 * tokenURIを取得してメタデータにアクセス（OpenSeaと同じフロー）
 */
async function main() {
    const contractAddress = "0xfba3BB65D179F9Dcd51a3b2B71D43ABBd0f6F0C6";
    const tokenId = process.argv[2] || "1";

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("OpenSeaと同じフローでメタデータ取得");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("コントラクト:", contractAddress);
    console.log("Token ID:", tokenId);
    console.log("ネットワーク:", hre.network.name);
    console.log("");

    // コントラクトに接続
    const VillainAmbassadorNFT = await hre.ethers.getContractFactory("VillainAmbassadorNFT");
    const contract = VillainAmbassadorNFT.attach(contractAddress);

    // ステップ1: tokenURIを取得（OpenSeaがやること）
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("ステップ1: tokenURI()を呼び出す");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    try {
        const tokenURI = await contract.tokenURI(tokenId);
        console.log("✅ tokenURIを取得:");
        console.log(tokenURI);
        console.log("");

        // ステップ2: そのURLにアクセス（OpenSeaがやること）
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("ステップ2: URLにアクセスしてJSONを取得");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("URL:", tokenURI);
        console.log("");
        console.log("以下のコマンドで確認:");
        console.log(`curl "${tokenURI}"`);
        console.log("");

        // コントラクトから直接データも確認
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("参考: コントラクトに保存されているデータ");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        const owner = await contract.ownerOf(tokenId);
        const rarity = await contract.tokenRarity(tokenId);
        const code = await contract.tokenCode(tokenId);

        console.log("Owner:", owner);
        console.log("Rarity:", rarity.toString());
        console.log("Code:", code);
        console.log("");

    } catch (error) {
        console.error("❌ エラー:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
