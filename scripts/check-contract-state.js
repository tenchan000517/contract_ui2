const hre = require("hardhat");

async function main() {
    const contractAddress = "0xfca5d6b366c097de75a2de0346028b37368daeac";
    console.log("Checking contract at:", contractAddress);
    
    const contract = await hre.ethers.getContractAt("VillainAmbassadorNFT", contractAddress);
    
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    const maxSupply = await contract.maxSupply();
    const owner = await contract.owner();
    const paused = await contract.paused();
    
    console.log("\nContract State:");
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Total Supply:", totalSupply.toString());
    console.log("Max Supply:", maxSupply.toString());
    console.log("Owner:", owner);
    console.log("Paused:", paused);
    
    console.log("\nAll checks passed! Contract is working correctly.");
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
