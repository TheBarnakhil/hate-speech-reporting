"use client";

// Add this line at the top
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import abi from "../contractFile/HateSpeechAbi.json";
import Web3 from "web3";
import { PinDataToPinata, UpdatePinataData  } from "./pinata";

require("dotenv").config();

interface ContractContextProps {
  connectToWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  handleReportData: (data: any, cid: string) => Promise<void>;
  reportHateSpeech: (data: any) => Promise<any>;
  walletAddress: string | null
}

const ContractContext = createContext<ContractContextProps | undefined>(undefined);

interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [contractInstance, setContractInstance] = useState<any>(null);
  const [reportData, setReportData] = useState<any>({});

  const web3 = new Web3(window.ethereum as any);
  const contractAddress = "0x43f32a17254B738b3807cB75794C208CC2ad5f49";

  useEffect(() => {
    if(reportData){
      reportHateSpeech(reportData)
    }
  },[reportData])

  useEffect(() => {
    const initializeContract = async () => {
      if (contractAddress && abi) {
        try {
          const instance = new web3.eth.Contract(abi.abi as any, contractAddress);
          setContractInstance(instance);
        } catch (error) {
          console.error("Error initializing contract instance:", error);
        }
      }
    };

    initializeContract();
  }, [contractAddress]);

  const handleReportData = async (data: any, cid: string) => {
    console.log(data, cid, "shooting..")
    setReportData({...data, cid});
  };

  const connectToWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const selectedAccount = accounts[0];
        setWalletAddress(selectedAccount);
        localStorage.setItem("walletAddress", selectedAccount);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("No compatible wallet provider detected");
    }
  };

  const disconnectWallet = async () => {
    if (web3.currentProvider && (web3.currentProvider as any).close) {
      await (web3.currentProvider as any).close();
      setWalletAddress(null);
      localStorage.removeItem("walletAddress");
    }
  };

  const protected_characteristics = [
    "race",
    "religion",
    "ethnic origin",
    "national origin",
    "sex",
    "disability",
    "sexual orientation",
    "gender identity",
    "neurotype",
  ];

  const HS_definition =
    '"Hate speech" is speech that attacks a person or group on the basis of attributes such as: ' +
    protected_characteristics.join(", ") +
    ".";

  const hsExamplesDict = [
    {
      exampleInput: "You lost! Succer!",
      exampleOutput: ["not hate speech", "", 1],
    },
    {
      exampleInput: "you hateful sack of flesh",
      exampleOutput: ["not hate speech", "", 1],
    },
    {
      exampleInput: "“Pick one, kidd,” one nudged. Then, “Choose FA GO TT.”",
      exampleOutput: ["hate speech", "sexual orientation", 1],
    },
    {
      exampleInput: "Aspie my ass. too slow to remember, so dont waste our time playing",
      exampleOutput: ["hate speech", "neurotype", 1],
    },
    {
      exampleInput:
        '“Kept being called a "Jew" for no reason.”; "A player on the other team was named Hitler.” “[One player] threatened to get antisemitic if I didnt talk. [They] talked about Jew tunnels.”',
      exampleOutput: ["hate speech", "race", 1],
    },
  ];

  let hsExamplesStr = "\n";
  hsExamplesDict.forEach(example => {
    hsExamplesStr += "\n" + JSON.stringify(example).slice(1, -1);
  });

  const reportHateSpeech = async (data:any) => {
    console.log(data,"oep")
    const prompt = `Consider the following definition: '${HS_definition}'. 
    Consider the following examples:'${hsExamplesDict}'.
    Classify the following fragment from a chat as hate speech or not hate speech, with respect to one of the following protected characteristics: '{protected_characteristics_str}'.
    Message: '${data.hateSpeech}'.
    The output should only contain 3 elements: "hate speech" or "not hate speech", protected characteristic label, and the probability with two decimal points.
    `;

    try {
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contractInstance.methods.runAgent(prompt, 6).estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);
      console.log("checking...!")


      const tx = await contractInstance.methods.runAgent(prompt, 2).send({
        from: walletAddress,
        gas: gasEstimate,
        gasPrice,
      });
      console.log("checking...")

      if (tx && tx.events && tx.events.AgentRunCreated && tx.events.AgentRunCreated.returnValues) {
        const runId = tx.events.AgentRunCreated.returnValues.runId;

        await isClassificationAvailable(runId);
      } else {
        console.error("AgentRunCreated event not found in transaction response:", tx);
      }
    

      return tx;
    } catch (error: any) {
      console.error("Error sending transaction:", error.message);
      return error;
    }
  };

  const isClassificationAvailable = async (runId: number) => {
    let isFinished = false;

    while (!isFinished) {
      try {
        isFinished = await contractInstance.methods.isRunFinished(runId).call({ from: walletAddress });
        console.log(isFinished)

        if (isFinished) {
          const messagesResponse = await getNewMessages(runId);
          console.log(messagesResponse,"response")

          if (messagesResponse) {
            await UpdatePinataData(messagesResponse[2], reportData)

            console.log("defination saved")
          } else {
            console.log("No response")
          }

        } else {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error:any) {
        console.error("Error checking run status:", error.message);
      }
    }
  };


  const getNewMessages = async (runId: number) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return {};
    }

    try {
      const gasEstimate = await contractInstance.methods
        .getMessageHistoryContents(runId)
        .estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);

      const messagesResponse = await contractInstance.methods.getMessageHistoryContents(runId).call({
        from: walletAddress,
        gas: gasEstimate,
      });

      console.log("Messages Response:", messagesResponse);

      return messagesResponse;
    } catch (error: any) {
      console.error("Error fetching new messages:", error.message);
      return {};
    }
  };

  return (
    <ContractContext.Provider
      value={{
        connectToWallet,
        disconnectWallet,
        handleReportData,
        walletAddress,
        reportHateSpeech
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = (): ContractContextProps => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};


