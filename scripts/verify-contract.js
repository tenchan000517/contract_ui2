const hre = require("hardhat");

/**
 * コントラクト検証スクリプト
 *
 * 使用方法:
 * npx hardhat run scripts/verify-contract.js --network arbitrum
 * npx hardhat run scripts/verify-contract.js --network mainnet
 * npx hardhat run scripts/verify-contract.js --network sepolia
 */

async function main() {
    // ============================================
    // ここを編集: デプロイ済みコントラクト情報
    // ============================================
    const contractAddress = "0xfca5d6b366c097de75a2de0346028b37368daeac";
    const constructorArgs = ["https://villain-nft-api.vercel.app/api/metadata/"];

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("コントラクト検証開始");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`ネットワーク: ${hre.network.name}`);
    console.log(`コントラクトアドレス: ${contractAddress}`);
    console.log(`コンストラクタ引数: ${JSON.stringify(constructorArgs)}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    try {
        console.log("Etherscan/Arbiscan検証を実行中...\n");

        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: constructorArgs,
        });

        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("✅ 検証成功！");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        // ネットワークに応じたURLを生成
        let explorerUrl;
        switch(hre.network.name) {
            case 'arbitrum':
                explorerUrl = `https://arbiscan.io/address/${contractAddress}#code`;
                break;
            case 'mainnet':
                explorerUrl = `https://etherscan.io/address/${contractAddress}#code`;
                break;
            case 'sepolia':
                explorerUrl = `https://sepolia.etherscan.io/address/${contractAddress}#code`;
                break;
            case 'polygon':
                explorerUrl = `https://polygonscan.com/address/${contractAddress}#code`;
                break;
            default:
                explorerUrl = `Unknown network: ${hre.network.name}`;
        }

        console.log(`検証済みコントラクト: ${explorerUrl}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    } catch (error) {
        if (error.message.includes("Already Verified")) {
            console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("ℹ️  このコントラクトは既に検証済みです");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        } else {
            console.error("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.error("❌ 検証失敗");
            console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.error("エラー:", error.message);
            console.error("\n手動検証コマンド:");
            console.error(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${constructorArgs[0]}"`);
            console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            throw error;
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
