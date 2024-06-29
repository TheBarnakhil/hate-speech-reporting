"use client"; // Add this line at the top

import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import abi from "../contractFile/HateSpeechAbi.json";
import Web3 from "web3";

require("dotenv").config();

interface ContractContextProps {
  connectToWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const ContractContext = createContext<ContractContextProps | undefined>(undefined);

interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(localStorage.getItem("walletAddress"));
  const [contractInstance, setContractInstance] = useState<any>(null);

  const web3 = new Web3(window.ethereum as any);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

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

  return (
    <ContractContext.Provider
      value={{
        connectToWallet,
        disconnectWallet,
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
