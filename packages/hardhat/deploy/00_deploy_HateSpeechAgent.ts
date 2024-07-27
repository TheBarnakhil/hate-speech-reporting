import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployHateSpeechAgent: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const systemPrompt = "You are a helpful assistant";
  const oracleAddress = process.env.ORACLE_ADDRESS;

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("HateSpeechAgent", {
    from: deployer,
    args: [oracleAddress,systemPrompt],
    log: true,
    autoMine: true,
  });

  const hateSpeechAgent = await hre.ethers.getContract<Contract>("HateSpeechAgent", deployer);
  console.log("👋 Initial greeting:", await hateSpeechAgent);
};

export default deployHateSpeechAgent;

deployHateSpeechAgent.tags = ["HateSpeechAgent"];
