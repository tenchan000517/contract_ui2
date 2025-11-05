const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    // デプロイされたコントラクトアドレス
    const contractAddress = "0xfca5d6b366c097de75a2de0346028b37368daeac";

    // MINTER_ROLEを付与するアドレス（管理用ウォレット）
    const minterAddress = "0x33fb3ad653b212a7fe898f5a31295dd25ccbd5ac";

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Granting MINTER_ROLE...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // コントラクトインスタンスを取得
    const contract = await hre.ethers.getContractAt(
        "VillainAmbassadorNFT",
        contractAddress
    );

    // MINTER_ROLEのハッシュを取得
    const MINTER_ROLE = await contract.MINTER_ROLE();

    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Deployer Address: ${deployer.address}`);
    console.log(`Minter Address: ${minterAddress}`);
    console.log(`MINTER_ROLE: ${MINTER_ROLE}\n`);

    // デプロイウォレットにMINTER_ROLEを付与
    console.log(`Granting MINTER_ROLE to deployer (${deployer.address})...`);
    const tx1 = await contract.grantRole(MINTER_ROLE, deployer.address);
    console.log(`Transaction Hash: ${tx1.hash}`);
    await tx1.wait();
    console.log("✅ MINTER_ROLE granted to deployer!\n");

    // 管理用ウォレットにMINTER_ROLEを付与
    console.log(`Granting MINTER_ROLE to minter (${minterAddress})...`);
    const tx2 = await contract.grantRole(MINTER_ROLE, minterAddress);
    console.log(`Transaction Hash: ${tx2.hash}`);
    await tx2.wait();
    console.log("✅ MINTER_ROLE granted to minter!\n");

    // 確認
    const deployerHasMinterRole = await contract.hasRole(MINTER_ROLE, deployer.address);
    const minterHasMinterRole = await contract.hasRole(MINTER_ROLE, minterAddress);
    console.log(`Deployer has MINTER_ROLE: ${deployerHasMinterRole}`);
    console.log(`Minter has MINTER_ROLE: ${minterHasMinterRole}`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
