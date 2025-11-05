const hre = require("hardhat");

/**
 * テストミントスクリプト
 * MINTER_ROLEを付与してからNFTをミント
 */
async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("テストミント開始");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("アカウント:", deployer.address);
    console.log("ネットワーク:", hre.network.name);
    console.log("");

    // コントラクトアドレス（Arbitrum - Token #0 テスト）
    const contractAddress = "0x8A285432dB4eA042f0d2cb998ff0A7304287ED53";

    // コントラクトに接続
    const VillainAmbassadorNFT = await hre.ethers.getContractFactory("VillainAmbassadorNFT");
    const contract = VillainAmbassadorNFT.attach(contractAddress);

    // MINTER_ROLEのハッシュを取得
    const MINTER_ROLE = await contract.MINTER_ROLE();
    console.log("MINTER_ROLE:", MINTER_ROLE);

    // デプロイヤーがMINTER_ROLEを持っているか確認
    const hasMinterRole = await contract.hasRole(MINTER_ROLE, deployer.address);
    console.log("デプロイヤーはMINTER_ROLEを持っている:", hasMinterRole);
    console.log("");

    if (!hasMinterRole) {
        console.log("MINTER_ROLEを付与中...");
        const grantTx = await contract.grantRole(MINTER_ROLE, deployer.address);
        await grantTx.wait();
        console.log("✅ MINTER_ROLEを付与しました");
        console.log("トランザクション:", grantTx.hash);
        console.log("");
    }

    // テストミント
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("NFTをミント中...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const testCases = [
        {
            to: deployer.address,
            rarity: 0, // Common
            code: "TEST1"
        }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const { to, rarity, code } = testCases[i];

        console.log(`\nテストケース ${i + 1}:`);
        console.log("  宛先:", to);
        console.log("  レアリティ:", rarity);
        console.log("  コード:", code);

        const mintTx = await contract.mint(to, rarity, code);
        const receipt = await mintTx.wait();

        // NFTMintedイベントからtokenIdを取得
        const event = receipt.logs.find(
            log => log.fragment && log.fragment.name === 'NFTMinted'
        );

        if (event) {
            const tokenId = event.args.tokenId;
            console.log("  ✅ ミント成功!");
            console.log("  トークンID:", tokenId.toString());
            console.log("  トランザクション:", mintTx.hash);
        } else {
            console.log("  ⚠️ イベントが見つかりませんでした");
        }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ テストミント完了");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nメタデータAPIで確認:");
    console.log("http://localhost:3000/api/metadata/1");
    console.log("http://localhost:3000/api/metadata/2");
    console.log("http://localhost:3000/api/metadata/3");
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
