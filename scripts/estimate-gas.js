const hre = require("hardhat");
const { ethers } = require("hardhat");

/**
 * Ethereum Mainnetのガス代シミュレーション
 * デプロイ、MINTER_ROLE付与、ミントのガス代を見積もります
 */
async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Ethereum Mainnet ガス代見積もり");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Network:", hre.network.name);
    console.log("Deployer:", deployer.address);
    console.log("");

    // 現在のガス価格を取得
    const feeData = await hre.ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    const maxFeePerGas = feeData.maxFeePerGas;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("現在のガス価格");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);
    console.log(`Max Fee Per Gas: ${ethers.formatUnits(maxFeePerGas, "gwei")} gwei`);
    console.log(`Max Priority Fee: ${ethers.formatUnits(maxPriorityFeePerGas, "gwei")} gwei`);
    console.log("");

    // 1. デプロイガス見積もり
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("1. コントラクトデプロイ");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const VillainAmbassadorNFT = await hre.ethers.getContractFactory("VillainAmbassadorNFT");
    const baseURI = "https://villain-nft-api.vercel.app/api/metadata/";

    // デプロイトランザクションのガス見積もり
    const deployTx = await VillainAmbassadorNFT.getDeployTransaction(baseURI);
    const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);

    const deployGasCost = estimatedGas * gasPrice;
    const deployGasCostEth = ethers.formatEther(deployGasCost);

    console.log(`Estimated Gas: ${estimatedGas.toString()}`);
    console.log(`Gas Cost: ${deployGasCostEth} ETH`);
    console.log("");

    // 2. MINTER_ROLE付与のガス見積もり
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("2. MINTER_ROLE付与");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // grantRoleのガス見積もり（およその値）
    const grantRoleGas = 50000n; // 実績値から推定
    const grantRoleGasCost = grantRoleGas * gasPrice;
    const grantRoleGasCostEth = ethers.formatEther(grantRoleGasCost);

    console.log(`Estimated Gas: ${grantRoleGas.toString()}`);
    console.log(`Gas Cost: ${grantRoleGasCostEth} ETH`);
    console.log("");

    // 3. ミントのガス見積もり
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("3. NFTミント (1回)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // mintのガス見積もり（およその値）
    const mintGas = 150000n; // 実績値から推定
    const mintGasCost = mintGas * gasPrice;
    const mintGasCostEth = ethers.formatEther(mintGasCost);

    console.log(`Estimated Gas: ${mintGas.toString()}`);
    console.log(`Gas Cost: ${mintGasCostEth} ETH`);
    console.log("");

    // 合計コスト計算
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("合計コスト見積もり");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const totalGas = estimatedGas + grantRoleGas + mintGas;
    const totalGasCost = deployGasCost + grantRoleGasCost + mintGasCost;
    const totalGasCostEth = ethers.formatEther(totalGasCost);

    console.log(`Total Gas: ${totalGas.toString()}`);
    console.log(`Total Cost: ${totalGasCostEth} ETH`);
    console.log("");

    // USD換算（ETH価格を取得できないので、手動で設定）
    const ethPriceUSD = 3000; // 仮の価格（実際の価格に合わせて変更してください）
    const totalCostUSD = parseFloat(totalGasCostEth) * ethPriceUSD;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("USD換算 (ETH = $" + ethPriceUSD + "で計算)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Total Cost: $${totalCostUSD.toFixed(2)} USD`);
    console.log("");

    // ガス価格別のシミュレーション
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("ガス価格別シミュレーション");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const gasPriceScenarios = [
        { label: "低速 (10 gwei)", gwei: 10n },
        { label: "標準 (20 gwei)", gwei: 20n },
        { label: "高速 (30 gwei)", gwei: 30n },
        { label: "最速 (50 gwei)", gwei: 50n },
        { label: "現在", gwei: gasPrice / 1000000000n }
    ];

    console.log("\n操作別ガス代 (全操作合計):\n");
    console.log("ガス価格          デプロイ+MINTER+ミント    USD換算");
    console.log("─────────────────────────────────────────────────");

    for (const scenario of gasPriceScenarios) {
        const scenarioGasPrice = scenario.gwei * 1000000000n;
        const scenarioCost = totalGas * scenarioGasPrice;
        const scenarioCostEth = ethers.formatEther(scenarioCost);
        const scenarioCostUSD = parseFloat(scenarioCostEth) * ethPriceUSD;

        console.log(
            `${scenario.label.padEnd(16)}  ${scenarioCostEth.padStart(8)} ETH        $${scenarioCostUSD.toFixed(2)}`
        );
    }

    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 推奨事項");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("• ガス代を節約するには、ガス価格が低い時間帯を狙う");
    console.log("• https://etherscan.io/gastracker でリアルタイム確認");
    console.log("• デプロイ前に十分なETH残高を確保してください");
    console.log("• 推奨残高: " + (parseFloat(totalGasCostEth) * 1.5).toFixed(4) + " ETH 以上");
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
