const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying QuestSealedRewards contract...");

  // Get the contract factory
  const QuestSealedRewards = await ethers.getContractFactory("QuestSealedRewards");

  // Deploy the contract
  // You'll need to provide a verifier address - this could be a multisig or trusted address
  const verifierAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual verifier address
  
  const questSealedRewards = await QuestSealedRewards.deploy(verifierAddress);

  await questSealedRewards.waitForDeployment();

  const contractAddress = await questSealedRewards.getAddress();
  
  console.log("QuestSealedRewards deployed to:", contractAddress);
  console.log("Verifier address:", verifierAddress);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    verifierAddress: verifierAddress,
    deployer: await questSealedRewards.runner.getAddress(),
    network: "sepolia",
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    './deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
