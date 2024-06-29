const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const initialOracleAddress = process.env.NEXT_ORACLE_ADDRESS;
  const systemPrompt = "You are a helpful assistant";

  if (!initialOracleAddress || !systemPrompt) {
    console.error("Environment variables REACT_APP_ORACLE_ADDRESS");
    return;
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const HateSpeech = await ethers.getContractFactory("HateSpeechAgent");
  console.log("Deploying HateSpeechAgent contract...");
  const hateSpeech = await HateSpeech.deploy(initialOracleAddress, systemPrompt);

  console.log("Contract deployed to:", hateSpeech);

  try {
    console.log("HateSpeechAgent contract deployed successfully");
  } catch (error) {
    console.error("Error executing HateSpeechAgent:", error);
  }
}

main().catch((error) => {
  console.error("Error deploying contract:", error);
});
