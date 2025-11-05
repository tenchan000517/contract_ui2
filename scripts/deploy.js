const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * ログディレクトリを作成
 */
const createLogDirectory = () => {
    const logDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    return logDir;
};

/**
 * デプロイログを記録
 */
const logDeployment = (network, contractName, contractAddress, txHash) => {
    const logDir = createLogDirectory();
    const date = new Date().toISOString();
    const etherscanUrl = `https://${network === 'mainnet' ? '' : network + '.'}etherscan.io/address/${contractAddress}`;

    // ネットワークごとのログ
    const networkLogPath = path.join(logDir, `network_logs_${network}.txt`);
    const networkLogEntry = `\n# Date: ${date}\nContract Name: ${contractName}\nContract Address: ${contractAddress}\nTransaction Hash: ${txHash}\nEtherscan URL: ${etherscanUrl}\n`;

    // 時系列ログ
    const chronologicalLogPath = path.join(logDir, 'chronological_logs.txt');
    const chronologicalLogEntry = `${date} - ${network} - ${contractName} - ${contractAddress}\n`;

    try {
        fs.appendFileSync(networkLogPath, networkLogEntry);
        console.log(`ネットワークログを ${networkLogPath} に追加しました。`);

        fs.appendFileSync(chronologicalLogPath, chronologicalLogEntry);
        console.log(`時系列ログを ${chronologicalLogPath} に追加しました。`);
    } catch (error) {
        console.error('ログの書き込み中にエラーが発生しました:', error);
    }
};

/**
 * メインデプロイ関数
 */
async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // コントラクト名とコンストラクタ引数
    const contractName = "VillainAmbassadorNFT";
    // baseURI: Vercelデプロイ後に更新する想定（仮URLでデプロイ）
    const constructorArgs = ["https://villain-nft-api.vercel.app/api/metadata/"];

    console.log(`Deploying ${contractName}...`);
    console.log("Constructor arguments:", constructorArgs);
    console.log("");

    // コントラクトのデプロイ（ethers v6構文）
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    const contract = await contractFactory.deploy(...constructorArgs);

    // デプロイ完了を待機（v6では waitForDeployment を使用）
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    const deployTx = contract.deploymentTransaction();

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Contract deployed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Transaction Hash: ${deployTx.hash}`);
    console.log(`Network: ${hre.network.name}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // ログに記録
    logDeployment(hre.network.name, contractName, contractAddress, deployTx.hash);

    // Etherscan検証のための待機時間
    if (hre.network.name !== 'localhost' && hre.network.name !== 'hardhat') {
        console.log("Waiting for block confirmations before verification...");
        await deployTx.wait(5); // 5ブロック待機

        console.log("\nStarting Etherscan verification...");
        try {
            await hre.run("verify:verify", {
                address: contractAddress,
                constructorArguments: constructorArgs,
            });
            console.log("✅ Verification successful!");
        } catch (error) {
            if (error.message.includes("Already Verified")) {
                console.log("ℹ️ Contract is already verified on Etherscan");
            } else {
                console.error("❌ Verification failed:", error.message);
                console.log("\nYou can verify manually with:");
                console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} ${constructorArgs.map(arg => `"${arg}"`).join(' ')}`);
            }
        }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Deployment Summary");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Contract: ${contractName}`);
    console.log(`Address: ${contractAddress}`);
    console.log(`Network: ${hre.network.name}`);
    console.log(`Deployer: ${deployer.address}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
