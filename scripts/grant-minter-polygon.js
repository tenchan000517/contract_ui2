const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const contractAddress = "0x168CCB189b180d6caBEf70fB8604227e300a092F";

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Granting MINTER_ROLE on Polygon...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const contract = await hre.ethers.getContractAt(
        "VillainAmbassadorNFT",
        contractAddress
    );

    const MINTER_ROLE = await contract.MINTER_ROLE();

    console.log(`Contract: ${contractAddress}`);
    console.log(`Deployer: ${deployer.address}`);
    console.log(`MINTER_ROLE: ${MINTER_ROLE}\n`);

    console.log("Granting MINTER_ROLE...");
    const tx = await contract.grantRole(MINTER_ROLE, deployer.address);
    console.log(`Transaction Hash: ${tx.hash}`);

    await tx.wait();
    console.log("✅ MINTER_ROLE granted!\n");

    const hasMinterRole = await contract.hasRole(MINTER_ROLE, deployer.address);
    console.log(`Has MINTER_ROLE: ${hasMinterRole}`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
