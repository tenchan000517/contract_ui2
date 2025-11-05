const hre = require("hardhat");

async function main() {
    const contractAddress = "0x168CCB189b180d6caBEf70fB8604227e300a092F";
    
    const VillainAmbassadorNFT = await hre.ethers.getContractFactory("VillainAmbassadorNFT");
    const contract = VillainAmbassadorNFT.attach(contractAddress);

    console.log("Contract:", contractAddress);
    console.log("Network:", hre.network.name);
    
    // DEFAULT_ADMIN_ROLEを持っているアドレスを確認
    const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    const [deployer] = await hre.ethers.getSigners();
    const hasAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
    
    console.log("Deployer:", deployer.address);
    console.log("Has Admin Role:", hasAdmin);
}

main().catch(console.error);
