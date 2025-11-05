const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`${hre.network.name.toUpperCase()} 残高確認`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("ウォレットアドレス:", deployer.address);
    console.log("ネットワーク:", hre.network.name);
    console.log("Chain ID:", hre.network.config.chainId);
    console.log("");

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    const balanceInEth = hre.ethers.formatEther(balance);

    console.log("残高:", balanceInEth, "ETH");
    console.log("");

    if (balance === 0n) {
        console.log("⚠️ 残高が0です！");
        console.log("");
        if (hre.network.name === "arbitrum") {
            console.log("ArbitrumにETHを送金する方法:");
            console.log("1. Ethereum MainnetからArbitrumにブリッジ");
            console.log("   https://bridge.arbitrum.io/");
            console.log("");
            console.log("2. 取引所から直接Arbitrumに送金");
            console.log("   - Binance, Coinbase, OKXなどがサポート");
        }
    } else {
        console.log("✅ デプロイ可能です");
        console.log("");
        console.log("推定デプロイコスト (Arbitrum):");
        console.log("- ガス価格: ~0.1 Gwei");
        console.log("- 推定コスト: 0.0001 - 0.001 ETH ($0.30 - $3)");
    }
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
