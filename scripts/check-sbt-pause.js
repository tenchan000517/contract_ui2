const hre = require("hardhat");

async function main() {
    const contractAddress = "0x8A285432dB4eA042f0d2cb998ff0A7304287ED53";

    const contract = await hre.ethers.getContractAt(
        "VillainAmbassadorNFT",
        contractAddress
    );

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Contract Status Check");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const isSBT = await contract.isSBT();
    const paused = await contract.paused();

    console.log(`Contract Address: ${contractAddress}`);
    console.log(`isSBT: ${isSBT}`);
    console.log(`paused: ${paused}\n`);

    if (isSBT) {
        console.log("⚠️ SBT mode is ENABLED - Transfers are BLOCKED");
    }
    if (paused) {
        console.log("⚠️ Contract is PAUSED - All operations are BLOCKED");
    }
    if (!isSBT && !paused) {
        console.log("✅ Transfers should work normally");
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
